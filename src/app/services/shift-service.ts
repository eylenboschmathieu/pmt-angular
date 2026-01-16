import { Injectable } from '@angular/core';
import { AcceptedShifts as AcceptedShiftsDTO } from '../entities/AcceptedShift';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DayRequest as DayRequestDTO } from '../entities/DayRequest';
import { DateDTO } from '../entities/DateRequest';
import { environment } from '../../environments/environment';

export class PlannedUser {
    id!: number  // Id of the request, not the user
    name!: string
    isIntern!: boolean
}

export class PlannedShift {
    volunteered!: PlannedUser[]
    confirmed!: PlannedUser[]
}

export class PlannedDayDTO {
    date!: Date
    shifts!: PlannedShift[]
}

class ShiftHoursDTO {
    from!: string
    to!: string
}

export class ShiftHours {
    from!: Date
    to!: Date
}

export class UpdateShiftPlanningDTO {
    confirm!: boolean
    shiftId!: number
}

class OverviewDataUser {
    id!: number
    name!: string
    confirmed!: number[]
    requested!: number
    total!: number
}

export class OverviewDataDTO {
    months!: Date[]
    users!: OverviewDataUser[]
}

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
    constructor(private http: HttpClient) {}

    url: string = environment.ENDPOINT_URI;
    private shift_hours!: ShiftHours[]

    get ShiftHours(): ShiftHours[] {
        return this.shift_hours
    }

    private createUTCTime(time: string): Date {
        var [hours, minutes, seconds] = time.split(':').map(Number)
        return new Date(Date.UTC(1970, 0, 1, hours, minutes, seconds))
    }

    // Init shift hours this app uses
    get_shift_hours(): void {
        this.http.get<ShiftHoursDTO[]>(this.url + "/shifts").pipe(
            tap(response => console.log(response)),
            catchError(this.handleError("get_shift_hours", [])),
            map((dto: ShiftHoursDTO[]) =>
                dto.map(e => (<ShiftHours> {
                    from: this.createUTCTime(e.from),
                    to: this.createUTCTime(e.to)
                })
            ))
        ).subscribe({
            next: (shiftHours: ShiftHours[]) => {
                this.shift_hours = shiftHours
            }
        })
    }

    // Get all year/month dates of all planning that was ever done
    get_planning_dates(): Observable<DateDTO[]> {
        // C# DateOnly objects are fetched from backend, so have to map them to Typescript Date objects.
        // Are treated as strings otherwise
        return this.http.get<DateDTO[]>(this.url + "/planning/dates").pipe(
            tap(res => console.log(res)),
            catchError(this.handleError("get_planning_dates", [])),
            map((dto: DateDTO[]) =>
                dto.map(e => ({
                        date: new Date(e.date),
                        locked: e.locked
                    })
                )
            )
        )
    }

    // Get all request data of a certain user for the chosen year/month
    get_requested(userId: number, year: number, month: number): Observable<DayRequestDTO[]> {
        const queryParams = (userId && year && month) ? { params: new HttpParams()
            .set('userId', userId)
            .set('year', year)
            .set('month', month)
        } : {};

        return this.http.get<DayRequestDTO[]>(this.url + "/requests", queryParams).pipe(
            tap(res => console.log(res)),
            catchError(this.handleError("get_requested", <DayRequestDTO[]>[])),
            map((dto: DayRequestDTO[]) =>
                dto.map(data => <DayRequestDTO> {
                    date: new Date(data.date),
                    id: data.id,
                    shifts: data.shifts
                })
            )
        )
    }

    // Get all planning data for the chosen year/month
    get_planning(year: number, month: number): Observable<PlannedDayDTO[]> {
        const queryParams = (year && month) ? { params: new HttpParams()
            .set('year', year)
            .set('month', month)
        } : {};

        return this.http.get<PlannedDayDTO[]>(this.url + "/planning", queryParams).pipe(
            tap(res => console.log(res)),
            catchError(this.handleError("get_planned", <PlannedDayDTO[]>[]))
        )
    }

    get_confirmed_shifts(userId: number, year: number, month: number): Observable<AcceptedShiftsDTO> { // Get all shifts you requested that were planned
        const queryParams = (userId && year && month) ? { params: new HttpParams()
            .set('userId', userId)
            .set('year', year)
            .set('month', month)
        } : {};

        return this.http.get<AcceptedShiftsDTO>(this.url + "/confirmed", queryParams).pipe(
            tap(res => console.log(res)),
            catchError(this.handleError("get_confirmed", <AcceptedShiftsDTO>{}))
        );
    }

    lock_month(date: Date, locked: boolean): Observable<any> {
        // Need to reformat the date because of DateOnly shenanigens on the back-end
        return this.http.put(this.url + "/planning/lock", { Date: date.toISOString().substring(0, 10), Locked: locked } ).pipe(
            tap(res => console.log(res)),
            catchError(this.handleError("lock_month", "null"))
        )
    }

    update_shift_request(userId: number, shift: Date, isRequested: boolean): Observable<boolean> {
        const queryParams = userId ? { params: new HttpParams().set('userId', userId) } : {};

        return this.http.put<boolean>(this.url + "/requests/update/", { shift: shift.toISOString(), isRequested: isRequested }, queryParams).pipe(
            tap(res => console.log(res)),
            catchError(this.handleError("update_shift_request", false))
        )
    }

    update_shift_planning(dto: UpdateShiftPlanningDTO): Observable<boolean> {
        return this.http.put<boolean>(this.url + "/planning/update", dto).pipe(
            tap(res => console.log(res)),
            catchError(this.handleError("update_shift_planning", false))
        )
    }

    get_overview(): Observable<OverviewDataDTO> {
        return this.http.get<OverviewDataDTO>(this.url + "/overview").pipe(
            tap(res => {
                console.log(res)
                res.months.forEach((date: Date) => date = new Date(date))
            }),
            catchError(this.handleError("get_overview", new OverviewDataDTO()))
        )
    }

    handleError<T>(operation = "operation", result?: T) {
        return (error: any): Observable<T> => {
            console.error(operation, error);
            return of(result as T);
        }
    }
}
