
export type userRole = 'admin' | 'rider' | 'driver';


export interface IUser {
    name:string,
    email:string,
    password:string,
    role:userRole,
    isBlocked:boolean,
    isAvailable:boolean,
    approved:boolean,
}