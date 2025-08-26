"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRideDetails = exports.updateAdminProfile = exports.getAdminProfile = exports.getRideOversight = exports.getDriverUpdateProfile = exports.getTotalRides = exports.getAnalytics = exports.getEarnings = exports.getDriverRideHistory = exports.getAllRideHistory = exports.getAllRides = exports.blockUser = exports.approveDriver = exports.getAllUsers = exports.toggleAvailability = exports.getEarning = exports.updateRideStatus = exports.acceptRide = exports.getRideHistory = exports.cancelRide = exports.rideRequest = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const ride_model_1 = require("./ride.model");
const user_model_1 = require("../user/user.model");
const rideRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { pickupLocation, destination } = req.body;
        const exitingRide = yield ride_model_1.Ride.findOne({
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
        const ride = yield ride_model_1.Ride.create({
            ride: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            pickupLocation: pickupLocation,
            destination: destination,
            status: "requested",
        });
        console.log(exports.rideRequest);
        res.status(201).json({
            sucess: true,
            message: "Ride Request Sucessfully",
            data: ride,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.rideRequest = rideRequest;
// cancel Ride
const cancelRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rideId = req.params.id;
        const ride = yield ride_model_1.Ride.findOne({ _id: rideId, ride: req.user.id });
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
        yield ride.save();
        res.status(200).json({
            message: "Ride Cancel Sucessfully!",
            Data: ride,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.cancelRide = cancelRide;
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
const getRideHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        // Rider-এর সব রাইড খুঁজে বের করা + pagination
        const rides = yield ride_model_1.Ride.find({ ride: req.user.id })
            .sort({ createdAt: -1 }) // latest আগে আসবে
            .skip(skip)
            .limit(Number(limit));
        // মোট কতগুলো রাইড আছে সেটা কাউন্ট করা
        const total = yield ride_model_1.Ride.countDocuments({ ride: req.user.id });
        res.status(200).json({
            success: true,
            message: "Ride history fetched successfully",
            total,
            page: Number(page),
            limit: Number(limit),
            data: rides,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch ride history",
            error,
        });
    }
});
exports.getRideHistory = getRideHistory;
const acceptRide = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rideId = req.params.id;
        const ride = yield ride_model_1.Ride.findById(rideId);
        if (!ride || ride.status !== "requested") {
            return res
                .status(400)
                .json({ message: "Ride not available for acceptance" });
        }
        ride.driver = req.user.id;
        ride.status = 'accepted';
        yield ride.save();
        res.status(200).json({
            sucess: true,
            message: "Ride is Accepted",
            data: ride,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.acceptRide = acceptRide;
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
const updateRideStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
        const ride = yield ride_model_1.Ride.findOne({ _id: rideId, driver: req.user.id });
        if (!ride) {
            return res.status(404).json({ message: "শুধু সেই ড্রাইভারই status আপডেট করতে পারবে, যাকে ride‑টা accepted করা আছে" });
        }
        ride.status = status;
        if (status === "completed") {
            ride.completedAt = new Date();
            ride.fare = (_a = ride.fare) !== null && _a !== void 0 ? _a : 200; // demo
        }
        if (status === "cancelled") {
            ride.cancelledAt = new Date();
        }
        yield ride.save();
        return res.status(200).json({
            success: true,
            message: "Ride status updated successfully",
            data: ride,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Failed to update ride status",
            error: (err === null || err === void 0 ? void 0 : err.message) || err,
        });
    }
});
exports.updateRideStatus = updateRideStatus;
const getEarning = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ride = yield ride_model_1.Ride.find({ driver: req.user.id, status: 'completed' });
        const total = ride.reduce((sum, rides) => sum + Number(rides.fare || 0), 0);
        res.status(200).json({
            sucess: true,
            message: "Driver Total Earnings!",
            data: total,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getEarning = getEarning;
// Driver Online Status 
const toggleAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driver = yield user_model_1.User.findById(req.user.id);
        if (!driver || driver.role !== 'driver') {
            return res.status(404).json({ message: 'Driver not found' });
        }
        driver.isAvailable = !driver.isAvailable;
        yield driver.save();
        res.status(200).json({
            message: `Availability set to ${driver.isAvailable ? 'Online' : 'Offline'}`,
            available: driver.isAvailable,
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to update availability', error: err });
    }
});
exports.toggleAvailability = toggleAvailability;
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
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, role } = req.query;
        let filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        if (role) {
            filter.role = role;
        }
        const users = yield user_model_1.User.find(filter);
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            total_user: users.length,
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error,
        });
    }
});
exports.getAllUsers = getAllUsers;
const approveDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driver = yield user_model_1.User.findById(req.params.id);
        if (!driver || driver.role !== 'driver') {
            return res.status(404).json({
                message: "Driver Not Found!"
            });
        }
        ;
        driver.approved = !driver.approved;
        yield driver.save();
        res.status(200).json({
            message: `Driver has been ${driver.approved ? 'approved' : 'suspended'}`,
            data: driver
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.approveDriver = approveDriver;
const blockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(req.params.id).select('-password');
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        user.isBlocked = !user.isBlocked;
        yield user.save();
        res.status(200).json({
            message: `User has been ${user.isBlocked ? 'blocked' : 'unblocked'}`,
            user,
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to update user block status', error: err });
    }
});
exports.blockUser = blockUser;
const getAllRides = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allRide = yield ride_model_1.Ride.find({}).populate([
            { path: 'driver', select: '-password' },
            { path: 'ride', select: '-password' },
        ]);
        res.status(200).json({
            sucess: true,
            message: "Retrive Ride & Driver data!!",
            data: allRide,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllRides = getAllRides;
const getAllRideHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ride = yield ride_model_1.Ride.findOne({ _id: req.params.id }).populate("driver", "-password").populate("ride", "-password");
        if (!ride) {
            return res.status(404).json({
                success: false,
                message: "Driver & Rider Data Not Found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Driver & Ride Data Retrived Successfully",
            data: ride
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllRideHistory = getAllRideHistory;
// Driver get rider all history 
const getDriverRideHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, from, to, page = 1, limit = 10 } = req.query;
        const filters = { driver: req.user.id };
        if (status)
            filters.status = status;
        if (from && to) {
            filters.requestedAt = {
                $gte: new Date(from),
                $lte: new Date(to),
            };
        }
        const rides = yield ride_model_1.Ride.find(filters)
            .sort({ createdAt: -1 })
            .skip((+page - 1) * +limit)
            .limit(+limit);
        const total = yield ride_model_1.Ride.countDocuments(filters);
        res.status(200).json({
            success: true,
            message: "Driver ride history fetched successfully",
            total,
            page: +page,
            limit: +limit,
            data: rides,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch driver history",
            error: err,
        });
    }
});
exports.getDriverRideHistory = getDriverRideHistory;
// Driver Total Earning = Daily|Weekly|Monthly
// ride.controller.ts
const getEarnings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { period } = req.query;
        const match = { driver: req.user.id, status: "completed" };
        const rides = yield ride_model_1.Ride.find(match);
        let total = 0;
        let breakdown = {};
        rides.forEach((ride) => {
            total += ride.fare || 0;
            if (!ride.completedAt)
                return;
            let dateKey = "all";
            if (period === "daily") {
                dateKey = ride.completedAt.toISOString().slice(0, 10); // yyyy-mm-dd
            }
            else if (period === "monthly") {
                dateKey = ride.completedAt.toISOString().slice(0, 7); // yyyy-mm
            }
            else if (period === "weekly") {
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
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch earnings",
            error: err,
        });
    }
});
exports.getEarnings = getEarnings;
const getAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalUsers = yield user_model_1.User.countDocuments();
        const totalDrivers = yield user_model_1.User.countDocuments({ role: 'driver' });
        const totalRides = yield ride_model_1.Ride.countDocuments();
        const revenueAgg = yield ride_model_1.Ride.aggregate([
            { $match: { status: "completed" }
            }, {
                $group: { _id: null, revenue: { $sum: "$fare" }
                }
            },
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].revenue : 0;
        res.status(200).json({
            success: true,
            message: "Analytics data fetched successfully",
            data: {
                totalUsers,
                totalDrivers,
                totalRides,
                totalRevenue,
            },
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch analytics data", error: err,
        });
    }
});
exports.getAnalytics = getAnalytics;
// GetTotals Rides 
const getTotalRides = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ride = yield ride_model_1.Ride.find({});
        console.log(ride);
        res.status(200).json({
            success: true,
            message: "Successfully Get All Rides",
            data: ride
        });
    }
    catch (error) {
        res.status(404).json({
            success: true,
            message: "Something Wrong Not Found Ride",
            error: error
        });
    }
});
exports.getTotalRides = getTotalRides;
// DriverUpdateProfile 
const getDriverUpdateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driver = yield user_model_1.User.findById(req.user.id);
        if (!driver) {
            return res.status(404).send({
                success: false,
                message: "Driver Not Found"
            });
        }
        if (driver.role !== "driver") {
            return res.status(401).send({
                success: false,
                message: "UnAuthrioze User "
            });
        }
        const { name, phone, vehicle, password } = req.body;
        if (name)
            driver.name = name;
        if (phone)
            driver.phone = phone;
        if (vehicle)
            driver.vehicle = vehicle;
        if (password)
            driver.password = yield bcrypt_1.default.hash(password, 10);
        yield driver.save();
        res.status(200).json({
            message: "Profile updated successfully",
            driver,
        });
    }
    catch (error) {
        return res.send({
            success: false,
            message: error
        });
    }
});
exports.getDriverUpdateProfile = getDriverUpdateProfile;
// RideSigntOut Details 
const getRideOversight = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, driver, rider, from, to } = req.query;
        let filter = {};
        if (status)
            filter.status = status;
        if (driver)
            filter.driver = driver;
        if (rider)
            filter.ride = rider;
        if (from && to) {
            filter.requestedAt = {
                $gte: new Date(from),
                $lte: new Date(to),
            };
        }
        const rides = yield ride_model_1.Ride.find(filter)
            .populate("driver", "name email")
            .populate("ride", "name email") // rider
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Ride oversight fetched successfully",
            total: rides.length,
            data: rides,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch ride oversight",
            error,
        });
    }
});
exports.getRideOversight = getRideOversight;
//  Get Admin Profile
const getAdminProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield user_model_1.User.findById(req.user.id).select("-password");
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        res.status(200).json({ success: true, user: admin });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch profile", err });
    }
});
exports.getAdminProfile = getAdminProfile;
//  Update Admin Profile
const updateAdminProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield user_model_1.User.findById(req.user.id);
        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        const { name, phone, password } = req.body;
        if (name)
            admin.name = name;
        if (phone)
            admin.phone = phone;
        if (password)
            admin.password = yield bcrypt_1.default.hash(password, 10);
        yield admin.save();
        res.status(200).json({ success: true, message: "Profile updated successfully", user: admin });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Failed to update profile", err });
    }
});
exports.updateAdminProfile = updateAdminProfile;
const getRideDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const ride = yield ride_model_1.Ride.findById(id)
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
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch ride details",
            error: err,
        });
    }
});
exports.getRideDetails = getRideDetails;
