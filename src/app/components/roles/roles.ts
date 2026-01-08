import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RoleService, Role } from '../../services/RoleService';

@Component({
    selector: 'app-roles',
    imports: [],
    templateUrl: './roles.html',
    styleUrl: './roles.css'
})
export class RolesComponent implements OnInit {
    roles: Role[] = [];

    constructor(private http: HttpClient, private roleService: RoleService) { }

    ngOnInit(): void {
        this.roleService.all().subscribe(roles => {
            this.roles = roles;
            console.log(roles);
        });
    }
}