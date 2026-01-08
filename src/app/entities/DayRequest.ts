export class DayRequest {
    id!: number
    date!: Date
    shifts: boolean[] = []  // Indexes relate to shift hours in chronological order, start at 6am
}