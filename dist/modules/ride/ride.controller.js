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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRides = exports.blockUser = exports.approveDriver = exports.getAllUsers = exports.toggleAvailability = exports.getEarning = exports.updateRideStatus = exports.acceptRide = exports.getRideHistory = exports.cancelRide = exports.rideRequest = void 0;
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
const getRideHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rideAllHistory = yield ride_model_1.Ride.find({ ride: req.user.id }).sort({
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
    }
    catch (error) { }
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
//  Get Updated Status
const updateRideStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const ride = yield ride_model_1.Ride.findOne({ _id: rideId, driver: req.user.id });
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found for this driver' });
        }
        // Update status
        ride.status = status;
        if (status === 'completed') {
            ride.completedAt = new Date();
            ride.fare = 200;
        }
        console.log(ride);
        yield ride.save();
        return res.status(200).json({
            success: true,
            message: 'Ride status updated successfully',
            data: ride,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Failed to update ride status',
            error: (err === null || err === void 0 ? void 0 : err.message) || err,
        });
    }
});
exports.updateRideStatus = updateRideStatus;
// Driver Total Earnings 
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
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.find({}).select('-password');
        const totalUser = yield user_model_1.User.countDocuments();
        if (!user) {
            return res.status(404).json({
                message: "User Not Found "
            });
        }
        ;
        res.status(200).json({
            sucess: true,
            message: "All User Fetch Sucessfully",
            total_user: totalUser,
            data: user,
        });
    }
    catch (error) {
        console.log(error);
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
