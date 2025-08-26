
export type userRole = 'admin' | 'rider' | 'driver';


export interface IUser {
    name:string,
    email:string,
    password:string,
    role:userRole,
    isBlocked:boolean,
    phone?:number,
    isAvailable:boolean,
    approved:boolean,
    emergencyContact?: string; 
     vehicle: string;
}