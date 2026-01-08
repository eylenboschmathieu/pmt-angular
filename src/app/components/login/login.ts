import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { AuthService } from '../../services/AuthService';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    styleUrl: './login.css'
})
export class LoginComponent implements OnInit, AfterViewInit {
    @ViewChild('googleButtonContainer') googleButtonContainer!: ElementRef;

    isLoggedIn = false;
    userEmail: string | null = null;
    userName: string | null = null;

    constructor(private http: HttpClient, private router: Router, public auth: AuthService) { }
    ngOnInit(): void {
        console.log("login.ngOnInit()");
        this.auth.init();
        if (this.auth.isLoggedIn) {
            this.router.navigate(["/home"]);
        }
    }
    
    ngAfterViewInit(): void {
        console.log("login.ngAfterViewInit()");
        this.auth.renderLoginButton("login-container");
    }
}