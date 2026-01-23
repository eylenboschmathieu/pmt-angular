import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, finalize, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { User } from '../entities/User';
import { ShiftService } from './shift-service';

declare const google: any;

export interface AuthResponse {
    token: string;
    name: string;
    email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private initialized: boolean = false;
    private _access_token!: string
    private _user!: User

    private _accessInProgress: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private _refreshInProgress: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private http: HttpClient, private router: Router, private shiftService: ShiftService) {}

    get access_token(): string { return this._access_token; }

    get Id(): number { return this._user.Id }

    get Name(): string { return this._user.Name }

    get Roles(): string[] { return this._user.Roles }

    get isLoggedIn(): boolean { return !!this.access_token }

    init() {
        if (!this.initialized && google) {
            console.log("auth.init()");
            google.accounts.id.initialize({
                client_id: environment.GOOGLE_CLIENT_ID,
                callback: this.handleCredentialResponse.bind(this),
                auto_select: false,
                cancel_on_tap_outside: true,
                login_uri: environment.ENDPOINT_URI + "/login",
                color_scheme: "dark"
            });
            // google.accounts.id.prompt();  // One Tap

            this.initialized = true;
        } else {
            console.log("Failed to initialize Google")
        }
    }

    handleCredentialResponse(google_response: any) {  // callback for google login
        console.log("handleCredentialResponse()");
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8')
        this.http.post<AuthResponse>(environment.ENDPOINT_URI + "/login", JSON.stringify(google_response.credential), { withCredentials: true, headers: headers }).subscribe({
            next: (res: any) => {
                if (res) {
                    var decoded = this.decodedAccessToken(res.access_token)
                    this._user = {
                        Id: decoded.sub,
                        Name: decoded.name,
                        Roles: decoded.Roles
                    }
                    this._access_token = res.access_token
                    console.log(`Logged in ${decoded.name}!`)
                    this.shiftService.get_shift_hours()
                    this.router.navigate(["/home"])
                }
            },
            error: (err) => {
                console.error("handleCredentialResponse()")
                switch (err.status) {
                    case HttpStatusCode.Unauthorized:
                        console.error("Unauthorized")
                        this.router.navigate(["/unauthorized"])
                        break;
                    case HttpStatusCode.BadRequest:
                        console.error("Bad Request")
                        break
                    default:
                        console.error('Login failed', err)
                        this.router.navigate(["/500"])
                }
            }
        });
    }

    access(): Observable<string> {
        if (this._accessInProgress.value) {
            console.log("AuthService->access->...")
            return this._accessInProgress.pipe(
                filter(inProgress => !inProgress),
                take(1),
                switchMap(() => {
                    console.log("AuthService->access->...->success");
                    return this._access_token ? of(this._access_token!) : throwError(() => new Error("No token after refresh"))
                })
            );
        }

        this._accessInProgress.next(true);

        console.log("AuthService->access")
        return this.http.post<string>(environment.ENDPOINT_URI + "/access", null, { withCredentials: true }).pipe(
            switchMap((res: any) => {
                console.log("AuthService.access->success")
                this._access_token = res.access_token
                var decoded = this.decodedAccessToken(res.access_token)
                this._user = {
                    Id: decoded.sub,
                    Name: decoded.name,
                    Roles: decoded.Roles
                }
                return of (res.access_token)
            }),
            catchError(err => {
                console.error("AuthService->access->error")
                return throwError(() => err)
            }),
            finalize(() => {
                console.log("AuthService->access->finalize")
                this._accessInProgress.next(false);
            })
        )
    }

    refresh(): Observable<AuthResponse> {
        if (this._refreshInProgress.value) {
            console.log("AuthService->refresh->...")
            this._refreshInProgress.pipe(
                filter(inProgress => inProgress = !inProgress),
                take(1)
            );
        }

        // Mark refresh as in-progress
        this._refreshInProgress.next(true)

        console.log("AuthService->refresh")
        return this.http.post<{ response: AuthResponse }>(environment.ENDPOINT_URI + "/refresh", null, { withCredentials: true }).pipe(
            tap((success: any) => {
                if (!success) {
                    console.log("Refresh not successful");
                    this.signout();
                    return throwError(() => new Error("No refresh token returned"))
                }
                console.log("AuthService->refresh->", success)
                return of();
            }),
            catchError(err => {
                this.clear();
                console.log("AuthService->refresh->error")
                return throwError(() => err)
            }),
            finalize(() => {
                console.log("AuthService->refresh->finalize")
                this._refreshInProgress.next(false)
            })
        );
    }

    renderLoginButton(elementId: string, options: any = null) {
        if (google && google.accounts && google.accounts.id) {
            if (!options) {
                options = {
                    theme: "filled_black",
                    text: "Sign in",
                    shape: "pill",
                    width: "300",
                    locale: "nl-BE"
                }
            }
            google.accounts.id.renderButton(document.getElementById(elementId), options);
        }
    }

    private decodedAccessToken(token: string): any {
        try {
            return jwtDecode(token);
        } catch (Error) {
            return null;
        }
    }

    isTokenExpiringSoon(thresholdMinutes: number = 5): boolean {
        if (!this._access_token) return true; // no access token, fetch one from backend

        const payloadBase64 = this._access_token!.split('.')[1];
        if (!payloadBase64) return true;

        try {
            const payloadJson = atob(payloadBase64);
            const payload = JSON.parse(payloadJson);
            
            if (!payload.exp) return true; // token has no expiry -> treat as invalid

            // Convert expiration (in seconds since epoch) to milliseconds
            const expiryDate = new Date(payload.exp * 1000);
            const now = new Date();

            const diffMs = expiryDate.getTime() - now.getTime();
            const diffMinutes = diffMs / 1000 / 60;

            console.log(diffMinutes, thresholdMinutes);
            return diffMinutes <= thresholdMinutes;
        } catch {
            // If decoding or parsing fails, assume token is invalid
            return true;
        }
    }

    signout() {
        this.http.post(environment.ENDPOINT_URI + "/logout", null, { withCredentials: true }).subscribe({
            next: (res: any) => {
                if (res) {  // Logged out on back-end
                    console.log("signout()");
                    this.clear()
                    google.accounts.id.disableAutoSelect();
                    this.router.navigate(["/login"]);
                }
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    clear() {
        this._access_token = null!
        this._user = null!
    }
}
