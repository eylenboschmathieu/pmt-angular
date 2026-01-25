import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserSelectDTO, UserService } from '../../services/user-service';
import { ShiftService } from '../../services/shift-service';
import { AuthService } from '../../services/auth-service';
import { DayShiftRequest } from "../paramedic-requested-day/paramedic-requested-day";
import { DayRequest } from '../../entities/DayRequest';
import { DateDTO } from '../../entities/DateRequest';
import { RouterLink } from "@angular/router";

export class ToggleShift {
    date!: Date
    shift!: number
    flag!: boolean
}

@Component({
    selector: 'app-paramedic-requested',
    imports: [FormsModule, DatePipe, DayShiftRequest, RouterLink],
    templateUrl: './paramedic-requested.html',
    styleUrl: './paramedic-requested.css'
})
export class ParamedicRequestedComponent {
    constructor(private authService: AuthService, private userService: UserService, private shiftService: ShiftService) {}

    private shifts: number[] = [5, 8, 11, 14, 18]  // UTC hours for shift starts

    initialized!: boolean

    users: UserSelectDTO[] = []
    dates: Date[] = []
    days: DayRequest[] = []

    selected_user!: UserSelectDTO
    selected_date!: Date

    ngOnInit(): void {
        this.userService.list().subscribe({
            next: (users: UserSelectDTO[]) => {
                this.users = users
                if (users.length > 0)
                    // Set self as selected user
                    var myId: number = this.authService.Id
                    var index = this.users.findIndex(e => e.id == myId)
                    this.selected_user = users[Math.max(0, index)]

                    this.shiftService.get_requested_dates().subscribe({
                        next: (dates: Date[]) => {
                            this.dates = dates
                            if (dates.length > 0)
                                this.selectDate(this.dates[0])
                            this.initialized = true
                        }
                    })
            }
        })
    }

    selectUser(user: UserSelectDTO): void {
        this.selected_user = user
        this.query()
    }

    selectDate(date: Date): void {
        this.selected_date = date
        this.query()
    }

    private query(): void {
        this.shiftService.get_requested(this.selected_user.id, this.selected_date.getFullYear(), this.selected_date.getMonth() + 1).subscribe({
            next: (days: DayRequest[]) => {
                this.days = days
            }
        })
    }

    private toDateTimeUTC(date: Date, shift: number): Date {
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), this.shifts[shift]))
    }

    // Callback from day component
    onShiftToggle(event: ToggleShift) {
        let day = this.days.find(e => e.date === event.date)
        if (day) {
            this.shiftService.update_shift_request(this.selected_user.id, this.toDateTimeUTC(day.date, event.shift), event.flag).subscribe({
                next: e => {
                    if (e) {
                        console.log("Request updated: " + e)
                        this.days = this.days.map(d => d.date === event.date ? {
                                ...d,
                                shifts: d.shifts.map((x, i) => i === event.shift ? event.flag : x)
                            } : d
                        );
                    }
                }
            })
        }
    }
}
