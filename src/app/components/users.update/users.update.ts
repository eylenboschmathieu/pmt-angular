import { Component } from '@angular/core';
import { UpdateUserDTO, UserData, UserService } from '../../services/user-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Role } from '../../entities/Role';
import { RoleService } from '../../services/RoleService';

@Component({
    selector: 'app-users.update',
    imports: [FormsModule, RouterLink, ReactiveFormsModule],
    templateUrl: './users.update.html',
    styleUrl: './users.update.css',
})
export class UsersUpdateComponent {
    constructor(private userService: UserService, private roleService: RoleService, private router: Router, private route: ActivatedRoute) {}

    initialized: boolean = false
    user!: UserData
    availableRoles!: Role[]

    updateForm!: FormGroup
    
    ngOnInit(): void {
        var userId = this.route.snapshot.paramMap.get('id')
        if (userId) {
            this.userService.get_user(Number.parseInt(userId)).subscribe({
                next: e => {
                    this.user = e
                    this.roleService.all().subscribe({
                        next: roles => {
                            const removeIds = new Set(this.user.roles.map(e => e.id))
                            this.availableRoles = roles.filter(role => !removeIds.has(role.id))
                            this.updateForm = new FormGroup({
                                name: new FormControl(e.name || ""),
                                email: new FormControl(e.email),
                                isActive: new FormControl(e.active),
                                createdBy: new FormControl(e.createdBy || '')
                            });
                            this.initialized = true
                        }
                    })
                }
            })
        }
    }

    updateUser(): void {
        if (!this.updateForm.valid) {
            console.log("Add user form not valid");
            return;
        }

        let user: UpdateUserDTO = {
            id: this.user.id,
            name: this.updateForm.get("name")!.value!,
            active: this.updateForm.get("isActive")!.value!,
            roles: this.user.roles.map(r => r.id),
        };
        this.userService.update(user).subscribe({
            next: () => this.router.navigate(["/users"])
        });
    }
    
    addTag(roleId: number) {
        this.user.roles.push(this.availableRoles.find(r => r.id == roleId)!);
        this.availableRoles = this.availableRoles.filter(r => r.id !== roleId);
    }

    removeTag(roleId: number) {
        this.availableRoles.push(this.user.roles.find(r => r.id == roleId)!);
        this.user.roles = this.user.roles.filter(r => r.id !== roleId);
    }

    // toggleActive(userId: number) {
    //     var index = this.users.findIndex(user => user.id == userId)
    //     this.userService.put_active(userId, !this.users[index].active).subscribe({
    //         next: (isUpdated: any) => {
    //             console.log(isUpdated);
    //             if (isUpdated) {
    //                 this.users[index].active = !this.users[index].active
    //             }
    //         }
    //     });
    // }
}
