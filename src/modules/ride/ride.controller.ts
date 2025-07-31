import { RIDE_STATUS } from "./ride.interface";
import { NextFunction, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { Ride } from "./ride.model";
import { User } from "../user/user.model";

export const rideRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { pickupLocation, destination } = req.body;

    const exitingRide = await Ride.findOne({
      ride: req.user.id,
      pickupLocation: pickupLocation,
      destination: destination,
      status: "requested",
    });

    if (exitingRide) {
      return res.status(409).json({
        sucess: false,
        message: "This Ride Data Already Exits DB!",
      });
    }

    const ride = await Ride.create({
      ride: req.user?.id,
      pickupLocation: pickupLocation,
      destination: destination,
      status: "requested",
    });

    console.log(rideRequest);

    res.status(201).json({
      sucess: true,
      message: "Ride Request Sucessfully",
      data: ride,
    });
  } catch (error) {
    console.log(error);
  }
};

// cancel Ride

export const cancelRide = async (req: AuthRequest, res: Response) => {
  try {
    const rideId = req.params.id;
    const ride = await Ride.findOne({ _id: rideId, ride: req.user.id });

    if (!ride) {
      return res.status(404).json({
        sucess: false,
        message: "Ride Not Found!",
      });
    }

    if (ride.status !== "requested") {
      return res.status(400).json({
        message: "you can also cancel RIDE",
      });
    }

    ride.status = "cancelled";
    ride.cancelledAt = new Date();
    await ride.save();

    res.status(200).json({
      message: "Ride Cancel Sucessfully!",
      Data: ride,
    });
  } catch (error) {
    console.log(error);
  }
};

// GetRideHistory

export const getRideHistory = async (req: AuthRequest, res: Response) => {
  try {
    const rideAllHistory = await Ride.find({ ride: req.user.id }).sort({
      createAt: -1,
    });

    if (!rideAllHistory) {
      return res.status(404).json({
        sucess: false,
        message: "Ride History Not Found!",
      });
    }

    res.status(200).json({
      sucess: true,
      message: "Ride History All Data Fetch Sucessfully!",
      data: rideAllHistory,
    });
  } catch (error) {}
};

export const acceptRide = async (req: AuthRequest, res: Response , next:NextFunction) => {
  try {
    const rideId = req.params.id;

    const ride = await Ride.findById( rideId );
   
    if (!ride || ride.status !== "requested") {
      return res
        .status(400)
        .json({ message: "Ride not available for acceptance" });
    }

    
    ride.driver=req.user.id;
    ride.status='accepted';
    await ride.save();

    res.status(200).json({
        sucess:true,
        message:"Ride is Accepted",
        data:ride,
    })


  } catch (error) {
    next(error)
  }
};


//  Get Updated Status

export const updateRideStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const rideId = req.params.id.trim();

    if (!status) {
      return res.status(400).json({ message: 'Status is required in body' });
    }

    const validStatuses = ['picked_up', 'in_transit', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    
    const ride = await Ride.findOne({ _id: rideId, driver: req.user.id });

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found for this driver' });
    }

    // Update status
    ride.status = status;

    
    if (status === 'completed') {
      ride.completedAt = new Date();
      ride.fare = 200;
    }
    console.log(ride)
    await ride.save();


    return res.status(200).json({
      success: true,
      message: 'Ride status updated successfully',
      data: ride,
    });
  } catch (err: any) {
    console.error( err);
    return res.status(500).json({
      message: 'Failed to update ride status',
      error: err?.message || err,
    });
  }
};


// Driver Total Earnings 

export const getEarning = async (req:AuthRequest, res:Response, next:NextFunction) => {

    try {

        const ride = await Ride.find({driver:req.user.id, status:'completed'});
        
        const total = ride.reduce((sum, rides) => sum + Number(rides.fare || 0), 0);

        res.status(200).json({
            sucess:true,
            message:"Driver Total Earnings!",
            data:total,
        })
        
    } catch (error) {
       next(error)
        
    }

}



// Driver Online Status 



export const toggleAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const driver = await User.findById(req.user.id);

    if (!driver || driver.role !== 'driver') {
      return res.status(404).json({ message: 'Driver not found' });
    }

    driver.isAvailable = !driver.isAvailable;
    await driver.save();

    res.status(200).json({
      message: `Availability set to ${driver.isAvailable ? 'Online' : 'Offline'}`,
      available: driver.isAvailable,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update availability', error: err });
  }
};



// --------------ADMIN Opearation--------------------------



export const getAllUsers = async (req:AuthRequest, res:Response) => {
    try {

        const user = await User.find({}).select('-password');
        const totalUser = await User.countDocuments();
        if(!user){
            return res.status(404).json({
                message:"User Not Found "
            })
        };

        res.status(200).json({
            sucess:true,
            message:"All User Fetch Sucessfully",
            total_user:totalUser,
            data:user,
        })
        
    } catch (error) {
        console.log(error)
        
    }

};


export const approveDriver  = async (req:AuthRequest, res:Response) => {
  try {
    const driver = await User.findById(req.params.id);
    if(!driver || driver.role !=='driver'){
      return res.status(404).json({
        message: "Driver Not Found!"
      })
    };

   driver.approved=!driver.approved;
   await driver.save();

   res.status(200).json({
    message: `Driver has been ${driver.approved ? 'approved': 'suspended'}`,
    data:driver
   });



  } catch (error) {
    console.log(error)
    
  }
};




export const blockUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      message: `User has been ${user.isBlocked ? 'blocked' : 'unblocked'}`,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user block status', error: err });
  }
};


export const getAllRides = async (req:AuthRequest, res:Response) => {
  try {
  
    const allRide = await Ride.find({}).populate([
      {path: 'driver', select:'-password'},
      {path: 'ride', select:'-password'},

    ]);
    res.status(200).json({
      sucess:true,
      message:"Retrive Ride & Driver data!!",
      data:allRide,
    })

    
  } catch (error) {
    console.log(error)
    
  }

};











