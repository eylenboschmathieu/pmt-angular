import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/AuthService';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home.component',
    imports: [RouterLink],
    templateUrl: './home.html',
    styleUrl: './home.css'
})
export class HomeComponent {
    username: string | null = null;

    constructor(public auth: AuthService) { }
}
