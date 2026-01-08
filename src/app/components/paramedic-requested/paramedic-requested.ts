import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserSelectDTO, UserService } from '../../services/user-service';
import { ShiftService } from '../../services/ShiftService';
import { AuthService } from '../../services/AuthService';
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

    private shifts: number[] = [6, 9, 12, 15, 19]

    initialized!: boolean

    users: UserSelectDTO[] = []
    dates: DateDTO[] = []
    days: DayRequest[] = []

    selected_user!: UserSelectDTO
    selected_date!: DateDTO

    ngOnInit(): void {
        this.userService.list().subscribe({
            next: (users: UserSelectDTO[]) => {
                this.users = users
                if (users.length > 0)
                    // Set self as selected user
                    var myId: number = this.authService.Id
                    var index = this.users.findIndex(e => e.id == myId)
                    this.selected_user = users[Math.max(0, index)]

                    this.shiftService.get_planning_dates().subscribe({
                        next: (dates: DateDTO[]) => {
                            // Don't allow shift requests after the cut-off date, or when the planning is already locked
                            var today: Date = new Date()
                            var todayUTC: Date = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDay() + 16))
                            this.dates = dates.filter(e => !e.locked && todayUTC < e.date)
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

    selectDate(date: DateDTO): void {
        this.selected_date = date
        this.query()
    }

    private query(): void {
        this.shiftService.get_requested(this.selected_user.id, this.selected_date.date.getFullYear(), this.selected_date.date.getMonth() + 1).subscribe({
            next: (days: DayRequest[]) => {
                this.days = days
            }
        })
    }

    private toDateTime(date: Date, shift: number): Date {
        return new Date(date.setHours(this.shifts[shift]))
    }

    // Callback from day component
    onShiftToggle(event: ToggleShift) {
        const day = this.days.find(e => e.date === event.date)
        if (day) {
            day.shifts[event.shift] = event.flag

            console.log(this.toDateTime(event.date, event.shift))

            this.shiftService.update_shift_request(this.selected_user.id, day.date, event.flag).subscribe({
                next: e => console.log("Request updated: " + e)
            })
        }
    }
}
