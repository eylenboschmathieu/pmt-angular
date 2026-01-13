import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, tap } from "rxjs";
import { Observable, of } from "rxjs";
import { Role as RoleDTO } from "../entities/Role";
import { environment } from "../../environments/environment";

export { Role } from "../entities/Role";

@Injectable({
providedIn: 'root',
})
export class RoleService {
    private url = environment.ENDPOINT_URI + "/roles";

    constructor(private http: HttpClient) {}

    all() : Observable<RoleDTO[]>{
        return this.http.get<RoleDTO[]>(this.url).pipe(
            tap(req => console.log(req)),
            catchError(this.handleError('all', []))
        );
    }

    private handleError<T>(operation = "operation", result? :T) {
        return (error: any): Observable<T> => {
            console.log(operation, error);
            return of(result as T);
        }
    }
}