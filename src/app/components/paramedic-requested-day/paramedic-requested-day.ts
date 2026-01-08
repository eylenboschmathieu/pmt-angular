import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DayRequest } from '../../entities/DayRequest';
import { ToggleShift } from '../paramedic-requested/paramedic-requested';

@Component({
  selector: 'app-paramedic-requested-day',
  imports: [DatePipe],
  templateUrl: './paramedic-requested-day.html',
  styleUrl: './paramedic-requested-day.css'
})

export class DayShiftRequest {
    readonly shift_strings = ["06:00 - 09:00", "09:00 - 12:00", "12:00 - 15:00", "15:00 - 19:00", "19:00 - 06:00"]
    cross_day: boolean = false

    @Input() day!: DayRequest
    @Output() onShiftToggle = new EventEmitter();

    ngOnChanges(): void {
        this.cross_day = this.day.shifts.every(b => b === false)
    }

    toggleRequest(index: number) {
        this.day.shifts[index] = !this.day.shifts[index]
        this.cross_day = this.day.shifts.every(b => b === false)

        var ts: ToggleShift = {
            date: this.day.date,
            shift: index,
            flag: this.day.shifts[index]
        }

        this.onShiftToggle.emit(ts)
    }
}
