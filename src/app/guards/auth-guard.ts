import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/AuthService';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private auth: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const isLoggedIn = this.auth.isLoggedIn
        let col = isLoggedIn ? "color: green" : "color: red";
        console.log("AuthGuard: %c" + this.router.url + " => %c" + state.url, col, col);

        if (!isLoggedIn)
            this.router.navigate(['/login']);

        return isLoggedIn;
    }
}
