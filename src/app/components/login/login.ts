import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/AuthService';
import { Router } from '@angular/router';
import { NewUserDTO, UserService } from '../../services/user-service';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
    imports: [FormsModule, ReactiveFormsModule],
    selector: 'app-login',
    templateUrl: './login.html',
    styleUrl: './login.css'
})
export class LoginComponent implements OnInit, AfterViewInit {
    @ViewChild('googleButtonContainer') googleButtonContainer!: ElementRef;

    constructor(private router: Router, private auth: AuthService, private userService: UserService) { }
    
    // Form exists to create a user for demonstration purposes
    createForm = new FormGroup({
        email: new FormControl("", [Validators.email, Validators.required]),
        emailConfirmation: new FormControl("", [Validators.required, this.matchValidator()])
    });

    ngOnInit(): void {
        console.log("login.ngOnInit()");
        this.auth.init();
        if (this.auth.isLoggedIn)
            this.router.navigate(["/home"]);
    }
    
    ngAfterViewInit(): void {
        console.log("login.ngAfterViewInit()");
        this.auth.renderLoginButton("login-container");
    }


    // All the following methods are here to create a user for demonstration purposes
    addUser() {
        if (!this.createForm.valid) {
            console.log("Add user form not valid");
            return;
        }

        let user: NewUserDTO = {
            Roles: [2, 3, 4],
            Email: this.createForm.get("email")!.value!
        };
        this.userService.demo_add(user).subscribe({
            next: () => {
                this.createForm.reset()
            }
        });
    }

    matchValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const emailConfirm = control as FormControl;
            const email = emailConfirm?.parent?.get("email") as FormControl;

            if (email && emailConfirm && email.value.toLowerCase() !== emailConfirm.value.toLowerCase()) {
                return { "emailMismatch": true };
            }

            return null;
        }
    }
}