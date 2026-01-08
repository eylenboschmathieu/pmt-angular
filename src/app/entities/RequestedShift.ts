import { User } from "./User";

export class RequestedShift {
    public id: number = null!;
    public user: User = null!;
    public date: Date = null!;
    public from: Date = null!;
    public to: Date = null!;
}