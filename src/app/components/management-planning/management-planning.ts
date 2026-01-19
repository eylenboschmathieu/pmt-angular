import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ShiftService, PlannedDayDTO, PlannedShift, UpdateShiftPlanningDTO } from '../../services/shift-service';
import { DateDTO } from '../../entities/DateRequest';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-management-planning',
  imports: [RouterLink, FormsModule, DatePipe],
  templateUrl: './management-planning.html',
  styleUrl: './management-planning.css',
})
export class ManagementPlanningComponent {
    constructor(public shiftService: ShiftService) {}
    
    initialized!: boolean
    dates: DateDTO[] = []
    selected_date!: DateDTO
    bShowDropdown: number = -1  // Set to -1 to hide all dropdown select boxes

    days: PlannedDayDTO[] = []

    ngOnInit(): void {
        this.shiftService.get_planning_dates().subscribe({
            next: (dates: DateDTO[]) => {
                this.dates = dates
                if (dates.length > 0)
                    this.selectDate(this.dates[0])
                    this.initialized = true
            }
        })
    }

    selectDate(date: DateDTO): void {
        this.bShowDropdown = -1
        this.selected_date = date
        this.shiftService.get_planning(this.selected_date.date.getFullYear(), this.selected_date.date.getMonth() + 1).subscribe({
            next: (planned_days: PlannedDayDTO[]) => {
                this.days = planned_days
            }
        })
    }

    lockMonth(flag: boolean): void {
        this.shiftService.lock_month(this.selected_date.date, flag).subscribe({
            next: res => {
                if (res) {  // Response returns true if lock was successful
                    this.selected_date.locked = flag
                }
            }
        })
    }

    // Line

    isFull(shift: PlannedShift): boolean {
        if (shift === null)
            return false

        return shift.confirmed.filter(e => !e.isIntern).length == 2
    }

    selectPick(shiftId: number, shift: PlannedShift): void {
        const index: number = shift.volunteered.findIndex(volunteer => volunteer.id === shiftId, 0)
        console.log("shiftId: " + shiftId)
        if (index > -1) {
            this.bShowDropdown = -1

            var dto: UpdateShiftPlanningDTO = {
                confirm: true,
                shiftId: shiftId
            }

            this.shiftService.update_shift_planning(dto).subscribe({
                next: res => {
                    if (res) { // Returns true if db was updated
                        shift.confirmed.push(shift.volunteered[index])
                        shift.volunteered.splice(index, 1)
                    }
                }
            })
        }
    }

    removePick(shiftId: number, shift: PlannedShift): void {
        const index: number = shift.confirmed.findIndex(volunteer => volunteer.id === shiftId, 0)
        if (index > -1) {
            var dto: UpdateShiftPlanningDTO = {
                confirm: false,
                shiftId: shiftId
            }

            this.shiftService.update_shift_planning(dto).subscribe({
                next: res => {
                    if (res) { // Returns true if db was updated
                        shift.volunteered.push(shift.confirmed[index])
                        shift.confirmed.splice(index, 1) 
                    }
                }
            })
        }
    }
}
