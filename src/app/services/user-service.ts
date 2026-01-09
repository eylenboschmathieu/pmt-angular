import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, ObjectUnsubscribedError, Observable, of, tap } from 'rxjs';
import { Role } from './RoleService';
import { environment } from '../../environments/environment.development';

export class NewUserDTO {
    public Email: string = null!;
    public Roles: Array<number> = null!;
}

export class UserResponse {
    public id!: number
    public name!: string
    public email!: string
    public active!: boolean
    public createdBy!: string
}

export class UserData {
    public id!: number
    public name!: string
    public email!: string
    public active!: boolean
    public createdBy!: string
    public roles!: Role[]
}

export class UpdateUserDTO {
    public id!: number
    public name!: string
    public active!: boolean
    public roles!: number[]  // List of role id's
}

export class UserSelectDTO { // Basic list of usernames with their internal id
    public id!: number
    public name!: string
    public icon!: string
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }

    url: string = environment.ENDPOINT_URI + "/users";

    all(): Observable<UserResponse[]> {  // Response returns {Id, Name, Email, CreatedBy}*
        return this.http.get<UserResponse[]>(this.url).pipe(
            tap(req => console.log(req)),
            catchError(this.handleError("all", []))
        );
    }

    get_user(userId: number): Observable<UserData> {
        return this.http.get<UserData>(this.url + "/" + userId).pipe(
            tap(req => console.log(req)),
            catchError(this.handleError("get_user", new UserData()))
        );
    }

    list(): Observable<UserSelectDTO[]> {  // Response returns {Id, Name, Icon}*
        return this.http.get<UserSelectDTO[]>(this.url + "/select").pipe(
            tap(req => console.log(req)),
            catchError(this.handleError("select", []))
        );
    }

    add(user: NewUserDTO): Observable<void> {
        return this.http.post<void>(this.url + "/new", user).pipe(
            catchError(this.handleError("add", void 0))
        );
    }

    update(user: UpdateUserDTO): Observable<boolean> {
        return this.http.put<boolean>(this.url + "/update/" + user.id, user).pipe(
            catchError(this.handleError("update", false))
        );
    }

    handleError<T>(operation = "operation", result?: T) {
        return (error: any): Observable<T> => {
            console.log(operation, error);
            return of(result as T);
        }
    }
}