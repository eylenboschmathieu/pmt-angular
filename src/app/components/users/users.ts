import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";

import { UserService, UserResponse } from '../../services/user-service';

@Component({
    selector: 'app-users.component',
    imports: [RouterLink],
    templateUrl: './users.html',
    styleUrl: './users.css',
})

export class UsersComponent implements OnInit {
    constructor(private userService: UserService) {}

    users: UserResponse[] = [];

    ngOnInit(): void {
        this.userService.all().subscribe({
            next: (users: UserResponse[]) => this.users = users
        })
    }
}
