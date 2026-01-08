import { inject } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { AuthService } from '../services/AuthService';
import { BehaviorSubject, catchError, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    if ([environment.LOGIN_URL, environment.ACCESS_URL, environment.REFRESH_URL].includes(req.url))
        
        return next(req);

    console.log("AuthInterceptor ", req.url);
    const router = inject(Router);
    const auth = inject(AuthService);

    if (auth.isTokenExpiringSoon()) {
        console.log("AuthInterceptor->expiring");

        return auth.access().pipe(
            tap(() => console.log("AuthInterceptor->access->success")),
            switchMap(token => next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }))),
            catchError(err => {
                console.error("AuthInterceptor->access->error");
                if ([HttpStatusCode.Forbidden, HttpStatusCode.Unauthorized].includes(err.status)) {
                    return auth.refresh().pipe(
                        tap(() => console.log("AuthInterceptor->refresh->success")),
                        switchMap(() => {
                            return auth.access().pipe(
                                tap(() => console.log("AuthInterceptor->refresh->access->success")),
                                switchMap((token) => next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }))),
                                catchError(err => {
                                    console.error("AuthInterceptor->refresh->access->error")
                                    router.navigate(["/login"]);
                                    return throwError(() => err);
                                })
                            )
                        }),
                        catchError(err => {
                            console.error("AuthInterceptor->refresh->error");
                            router.navigate(["/login"]);
                            return of();
                        })
                    );
                }
                return throwError(() => err.error);
            })
        );
    }
    else {
        const access_token = auth.access_token;
        const authReq = access_token ? req.clone({ setHeaders: { Authorization: `Bearer ${access_token}` } }) : req;

        return next(authReq).pipe(
            catchError((err: HttpErrorResponse) => {
                console.log("AuthInterceptor->error = ", err.status, req.url);
                if ([HttpStatusCode.Unauthorized, HttpStatusCode.Forbidden].includes(err.status)) {
                    router.navigate(["/unauthorized"]);
                }

                return throwError(() => err);
            }
        ));
    }
};