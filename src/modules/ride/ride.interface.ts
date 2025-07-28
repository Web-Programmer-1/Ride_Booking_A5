import { Types } from "mongoose";

export type RIDE_STATUS = 'requested' | 'accepted' | 'picked_up' | 'in_transit' | 'completed' | 'cancelled';


export interface IRide {
    ride:Types.ObjectId,
    driver?:Types.ObjectId,
    pickupLocation:string,
    destination:string,
    status:RIDE_STATUS,
    fare?:number,
    requestedAt?:Date,
    cancelledAt?:Date,
    completedAt?:Date,
}