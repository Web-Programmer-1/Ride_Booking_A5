import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { Ride } from "./ride.model";


export const rideRequest = async(req:AuthRequest, res:Response) => {
    try {

        const {pickupLocation, destination} = req.body;

        const ride = await Ride.create({
            ride:req.user?.id,
            pickupLocation:pickupLocation,
            destination:destination,
            status:'requested',
        });

        res.status(201).json({
            sucess:true,
            message:"Ride Request Sucessfully",
            data: ride,
        })




        
    } catch (error) {
        console.log(error)
        
    }

}