import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl, ReactiveFormsModule, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms'
import { Router } from '@angular/router';
import { Role } from '../../entities/Role';
import { RoleService } from '../../services/RoleService';
import { UserService, NewUserDTO } from '../../services/user-service';

@Component({
    selector: 'app-users.new.component',
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: './users.create.html',
    styleUrl: './users.create.css'
})
export class UsersCreateComponent implements OnInit {
    constructor(private router: Router, private roleService: RoleService, private userService: UserService) { }
    
    initialized!: boolean
    availableRoles: Role[] = []
    selectedRoles: Role[] = []

    addForm = new FormGroup({
        email: new FormControl("", [Validators.email, Validators.required]),
        emailConfirmation: new FormControl("", [Validators.required, this.matchValidator()])
    });

    ngOnInit(): void {
        this.roleService.all().subscribe({
            next: roles => {
                this.availableRoles = roles
                this.initialized = true
            }
        });
    }

    addUser() {
        if (!this.addForm.valid) {
            console.log("Add user form not valid");
            return;
        }

        let user: NewUserDTO = {
            Roles: this.selectedRoles.map(r => r.id),
            Email: this.addForm.get("email")!.value!
        };
        this.userService.add(user).subscribe({ next: () => this.router.navigate(["users"]) });
    }

    addTag(roleId: number) {
        this.selectedRoles.push(this.availableRoles.find(r => r.id == roleId)!);
        this.availableRoles = this.availableRoles.filter(r => r.id !== roleId);
    }

    removeTag(roleId: number) {
        this.availableRoles.push(this.selectedRoles.find(r => r.id == roleId)!);
        this.selectedRoles = this.selectedRoles.filter(r => r.id !== roleId);
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