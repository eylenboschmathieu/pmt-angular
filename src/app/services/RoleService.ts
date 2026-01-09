import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, tap } from "rxjs";
import { Observable, of } from "rxjs";
import { Role } from "../entities/Role";
import { environment } from "../../environments/environment.development";

export { Role } from "../entities/Role";

@Injectable({
providedIn: 'root',
})
export class RoleService {
    private url = environment.ENDPOINT_URI + "/roles";

    constructor(private http: HttpClient) {}

    all() : Observable<Role[]>{
        return this.http.get<Role[]>(this.url).pipe(
            tap(req => console.log(req)),
            catchError(this.handleError('findRoles', []))
        );
    }

    private handleError<T>(operation = "operation", result? :T) {
        return (error: any): Observable<T> => {
            console.log(operation, error);
            return of(result as T);
        }
    }
}