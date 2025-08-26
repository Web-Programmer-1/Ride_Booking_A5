import bcrypt from "bcrypt";
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

// export const getRideHistory = async (req: AuthRequest, res: Response) => {
//   try {
//     const rideAllHistory = await Ride.find({ ride: req.user.id }).sort({
//       createAt: -1,
//     });

//     if (!rideAllHistory) {
//       return res.status(404).json({
//         sucess: false,
//         message: "Ride History Not Found!",
//       });
//     }

//     res.status(200).json({
//       sucess: true,
//       message: "Ride History All Data Fetch Sucessfully!",
//       data: rideAllHistory,
//     });
//   } catch (error) {}
// };



export const getRideHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Rider-এর সব রাইড খুঁজে বের করা + pagination
    const rides = await Ride.find({ ride: req.user.id })
      .sort({ createdAt: -1 }) // latest আগে আসবে
      .skip(skip)
      .limit(Number(limit));

    // মোট কতগুলো রাইড আছে সেটা কাউন্ট করা
    const total = await Ride.countDocuments({ ride: req.user.id });

    res.status(200).json({
      success: true,
      message: "Ride history fetched successfully",
      total,
      page: Number(page),
      limit: Number(limit),
      data: rides,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ride history",
      error,
    });
  }
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













// export const updateRideStatus = async (req: AuthRequest, res: Response) => {
//   try {
//     const { status } = req.body;
//     const rideId = req.params.id.trim();

//     if (!status) {
//       return res.status(400).json({ message: 'Status is required in body' });
//     }

//     const validStatuses = ['picked_up', 'in_transit', 'completed'];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ message: 'Invalid status update' });
//     }

    
//     const ride = await Ride.findOne({ _id: rideId, driver: req.user.id });

//     if (!ride) {
//       return res.status(404).json({ message: 'Ride not found for this driver' });
//     }

//     // Update status
//     ride.status = status;

    
//     if (status === 'completed') {
//       ride.completedAt = new Date();
//       ride.fare = 200;
//     }
//     console.log(ride)
//     await ride.save();


//     return res.status(200).json({
//       success: true,
//       message: 'Ride status updated successfully',
//       data: ride,
//     });
//   } catch (err: any) {
//     console.error( err);
//     return res.status(500).json({
//       message: 'Failed to update ride status',
//       error: err?.message || err,
//     });
//   }
// };


// Driver Total Earnings 




// controllers/ride.controller.ts



export const updateRideStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const rideId = req.params.id.trim();

    if (!status) {
      return res.status(400).json({ message: "Status is required in body" });
    }

   
    const validStatuses = ["picked_up", "in_transit", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const ride = await Ride.findOne({ _id: rideId, driver: req.user.id });
    if (!ride) {
      return res.status(404).json({ message: "শুধু সেই ড্রাইভারই status আপডেট করতে পারবে, যাকে ride‑টা accepted করা আছে" });
    }

    ride.status = status as any;

    if (status === "completed") {
      ride.completedAt = new Date();
      ride.fare = ride.fare ?? 200; // demo
    }
    if (status === "cancelled") {
      ride.cancelledAt = new Date();
    }

    await ride.save();

    return res.status(200).json({
      success: true,
      message: "Ride status updated successfully",
      data: ride,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to update ride status",
      error: err?.message || err,
    });
  }
};








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



// export const getAllUsers = async (req:AuthRequest, res:Response) => {
//     try {

//         const user = await User.find({}).select('-password');
//         const totalUser = await User.countDocuments();
//         if(!user){
//             return res.status(404).json({
//                 message:"User Not Found "
//             })
//         };

//         res.status(200).json({
//             sucess:true,
//             message:"All User Fetch Sucessfully",
//             total_user:totalUser,
//             data:user,
//         })
        
//     } catch (error) {
//         console.log(error)
        
//     }

// };





export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { search, role } = req.query;
    let filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: "i" } },
        { email: { $regex: search as string, $options: "i" } },
      ];
    }
    if (role) {
      filter.role = role;
    }
    const users = await User.find(filter);

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      total_user: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error,
    });
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





export const getAllRideHistory = async (req:AuthRequest, res:Response) => {
  try {
     
    const ride = await Ride.findOne({_id:req.params.id}).populate("driver", "-password").populate("ride", "-password");

    if(!ride){
      return res.status(404).json({
        success:false,
        message:"Driver & Rider Data Not Found",
      
      })
    }

    res.status(200).json({
      success:true,
      message:"Driver & Ride Data Retrived Successfully",
      data:ride
    })


  } catch (error) {
    console.log(error)

    
  }

};





// Driver get rider all history 


export const getDriverRideHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { status, from, to, page = 1, limit = 10 } = req.query;

    const filters: any = { driver: req.user.id };

    if (status) filters.status = status;
    if (from && to) {
      filters.requestedAt = {
        $gte: new Date(from as string),
        $lte: new Date(to as string),
      };
    }

    const rides = await Ride.find(filters)
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Ride.countDocuments(filters);

    res.status(200).json({
      success: true,
      message: "Driver ride history fetched successfully",
      total,
      page: +page,
      limit: +limit,
      data: rides,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch driver history",
      error: err,
    });
  }
};




// Driver Total Earning = Daily|Weekly|Monthly


// ride.controller.ts
export const getEarnings = async (req: AuthRequest, res: Response) => {
  try {
    const { period } = req.query;
    const match: any = { driver: req.user.id, status: "completed" };

    const rides = await Ride.find(match);

    let total = 0;
    let breakdown: Record<string, number> = {};

    rides.forEach((ride) => {
      total += ride.fare || 0;

      if (!ride.completedAt) return;

      let dateKey = "all";
      if (period === "daily") {
        dateKey = ride.completedAt.toISOString().slice(0, 10); // yyyy-mm-dd
      } else if (period === "monthly") {
        dateKey = ride.completedAt.toISOString().slice(0, 7); // yyyy-mm
      } else if (period === "weekly") {
        const d = new Date(ride.completedAt);
        const week = Math.ceil(d.getDate() / 7);
        dateKey = `${d.getFullYear()}-W${week}`;
      }

      breakdown[dateKey] = (breakdown[dateKey] || 0) + (ride.fare || 0);
    });

    res.status(200).json({
      success: true,
      message: "Driver earnings fetched successfully",
      total,
      breakdown,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch earnings",
      error: err,
    });
  }
};






export const getAnalytics = async (req: AuthRequest, res: Response) => { try { 
  const totalUsers = await User.countDocuments(); 
  const totalDrivers = await User.countDocuments({ role: 'driver' }); 
  const totalRides = await Ride.countDocuments(); 
  const revenueAgg = await Ride.aggregate([ 
    { $match: 
      { status: "completed" } 
    }, {
       $group: 
       { _id: null, revenue: { $sum: "$fare" }
       } },
   ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].revenue : 0;
     res.status(200).json({
       success: true, 
       message: "Analytics data fetched successfully",
        data: { 
          totalUsers,
           totalDrivers,
            totalRides,
             totalRevenue, }, });
             } catch (err) {
               res.status(500).json({ 
                success: false,
                 message: "Failed to fetch analytics data", error: err, }); } };






// GetTotals Rides 


export const getTotalRides = async (req:AuthRequest, res:Response) => {
  try {
    const ride = await Ride.find({});
    console.log(ride)

    res.status(200).json({
      success:true,
      message:"Successfully Get All Rides",
      data:ride
    })
    
  } catch (error) {
     res.status(404).json({
      success:true,
      message:"Something Wrong Not Found Ride",
      error:error
    })
    
  }
}



// DriverUpdateProfile 


export const getDriverUpdateProfile = async (req:AuthRequest, res:Response) => {

  try {

    const driver = await User.findById(req.user.id);

    if(!driver){
      return res.status(404).send({
        success:false,
        message:"Driver Not Found"
      })
    }

    if(driver.role !== "driver"){
      return res.status(401).send({
        success:false,
        message:"UnAuthrioze User "
      })
    }

        const { name, phone, vehicle, password } = req.body;

    if (name) driver.name = name;
    if (phone) driver.phone = phone;
    if (vehicle) driver.vehicle = vehicle;
    if (password) driver.password = await bcrypt.hash(password, 10);

    await driver.save();

    res.status(200).json({
      message: "Profile updated successfully",
      driver,
    });




    
  } catch (error) {
    return res.send({
      success:false,
      message:error
    })
    
  }

}




// RideSigntOut Details 





export const getRideOversight = async (req: AuthRequest, res: Response) => {
  try {
    const { status, driver, rider, from, to } = req.query;

    let filter: any = {};

    if (status) filter.status = status;
    if (driver) filter.driver = driver;
    if (rider) filter.ride = rider;

    if (from && to) {
      filter.requestedAt = {
        $gte: new Date(from as string),
        $lte: new Date(to as string),
      };
    }

    const rides = await Ride.find(filter)
      .populate("driver", "name email")
      .populate("ride", "name email") // rider
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Ride oversight fetched successfully",
      total: rides.length,
      data: rides,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch ride oversight",
      error,
    });
  }
};



//  Get Admin Profile


export const getAdminProfile = async (req: AuthRequest, res: Response) => {
  try {
    const admin = await User.findById(req.user.id).select("-password");
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    res.status(200).json({ success: true, user: admin });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch profile", err });
  }
};




//  Update Admin Profile
export const updateAdminProfile = async (req: AuthRequest, res: Response) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { name, phone, password } = req.body;

    if (name) admin.name = name;
    if (phone) admin.phone = phone;
    if (password) admin.password = await bcrypt.hash(password, 10);

    await admin.save();

    res.status(200).json({ success: true, message: "Profile updated successfully", user: admin });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update profile", err });
  }
};





export const getRideDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const ride = await Ride.findById(id)
      .populate("driver", "name email phone vehicle")
      .populate("ride", "name email phone");

    if (!ride) {
      return res.status(404).json({ success: false, message: "Ride not found" });
    }

    res.status(200).json({
      success: true,
      message: "Ride details fetched",
      data: ride,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch ride details",
      error: err,
    });
  }
};









