import { Component } from '@angular/core';
import { UserService, UserSelectDTO } from '../../services/user-service';
import { ShiftService } from '../../services/ShiftService';
import { AcceptedShifts } from '../../entities/AcceptedShift';
import { DatePipe } from '@angular/common';
import { DateDTO } from '../../entities/DateRequest';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/AuthService';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-paramedic-accepted',
    imports: [DatePipe, FormsModule, RouterLink],
    templateUrl: './paramedic-accepted.html',
    styleUrl: './paramedic-accepted.css'
})
export class ParamedicAcceptedComponent {
    constructor(private authService: AuthService, private userService: UserService, private shiftService: ShiftService) { }

    initialized!: boolean

    users: UserSelectDTO[] = [];
    selected_user: UserSelectDTO = null!

    dates: DateDTO[] = []
    selected_date: Date = null!

    accepted_shifts: AcceptedShifts = null!;
    
    ngOnInit(): void {
        this.userService.list().subscribe({
            next: (users: UserSelectDTO[]) => {
                this.users = users
                if (users.length > 0) {
                    // Set self as selected user
                    var myId: number = this.authService.Id
                    var index = this.users.findIndex(e => e.id == myId)
                    this.selected_user = users[Math.max(0, index)]

                    this.shiftService.get_planning_dates().subscribe({
                        next: (dates: DateDTO[]) => {
                            this.dates = dates.filter(e => e.locked)
                            if (this.dates.length > 0)
                                this.selectDate(this.dates[0].date)
                            this.initialized = true
                        }
                    })
                }
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

    query(): void {
        this.shiftService.get_confirmed_shifts(this.selected_user.id, this.selected_date.getFullYear(), this.selected_date.getMonth() + 1).subscribe({
            next: (shifts: AcceptedShifts) => {
                this.accepted_shifts = shifts
            }
        })
    }
}
