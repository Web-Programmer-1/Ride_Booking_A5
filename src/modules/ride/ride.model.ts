import mongoose, { Schema } from "mongoose";
import { IRide } from "./ride.interface";


const rideSchema = new Schema<IRide>({
    ride:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    driver:{
        type:Schema.Types.ObjectId,
        ref:"User",
        
    },
    pickupLocation: {
        type:String,
        // required:true,
    },

    destination: {
        type:String,
        required:true,

    },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'picked_up', 'in_transit', 'completed', 'cancelled'],
      default: 'requested',
    },
    fare: { type: Number },
    requestedAt: { type: Date, default: Date.now },
    cancelledAt: { type: Date },
    completedAt: { type: Date },


}, {
    timestamps:true,
    versionKey:false,
});

export const Ride = mongoose.model<IRide>("Ride", rideSchema);