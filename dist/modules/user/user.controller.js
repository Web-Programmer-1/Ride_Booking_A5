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
exports.logout = exports.me = exports.sendSOS = exports.saveEmergencyContact = exports.login = exports.updateProfile = exports.getUserProfile = exports.register = void 0;
const user_model_1 = require("./user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../../util/jwt");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = yield user_model_1.User.findOne({ email: email });
        if (existingUser) {
            return res.json({
                message: "Email Already Exiting",
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield user_model_1.User.create({
            name: name,
            email: email,
            password: hashedPassword,
            role: role,
        });
        res.status(201).json({
            sucess: true,
            message: "User created Sucessfully",
            data: user,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.register = register;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield user_model_1.User.findById(userId).select("-password"); // hide password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getUserProfile = getUserProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phone, password } = req.body;
        const update = {};
        if (typeof name === "string")
            update.name = name;
        if (typeof phone === "string")
            update.phone = phone;
        if (password && password.trim()) {
            update.password = yield bcrypt_1.default.hash(password, 10);
        }
        const user = yield user_model_1.User.findByIdAndUpdate(req.user.id, update, {
            new: true,
            runValidators: true,
        }).select("name email phone role");
        if (!user)
            return res.status(404).json({ success: false, message: "User not found" });
        return res.json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        });
    }
    catch (e) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.updateProfile = updateProfile;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "Email is not found!" });
        }
        const isMatchPass = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatchPass) {
            return res.status(400).json({ success: false, message: "Password didn't match" });
        }
        if (user.isBlocked) {
            return res.status(403).json({ success: false, message: "User is Blocked!" });
        }
        const token = (0, jwt_1.generateToken)({ id: user._id, role: user.role });
        const isProd = process.env.NODE_ENV === "production";
        const FIFTY_DAYS_MS = 50 * 24 * 60 * 60 * 1000;
        res.cookie("access-token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: FIFTY_DAYS_MS,
        });
        return res.status(200).json({
            success: true,
            message: "Login successful",
            email: user.email,
            role: user.role,
            user: { id: user._id, role: user.role, email: user.email },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Login failed", error });
    }
});
exports.login = login;
const saveEmergencyContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contact } = req.body;
        const user = yield user_model_1.User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        user.emergencyContact = contact;
        yield user.save();
        res.status(200).json({
            success: true,
            message: "Emergency contact saved successfully",
            data: { emergencyContact: user.emergencyContact },
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to save emergency contact",
            error: err,
        });
    }
});
exports.saveEmergencyContact = saveEmergencyContact;
// SMS
const sendSOS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (!user.emergencyContact) {
            return res.status(400).json({
                success: false,
                message: "No emergency contact saved",
            });
        }
        res.status(200).json({
            success: true,
            message: `SOS sent to ${user.emergencyContact}`,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to send SOS",
            error: err,
        });
    }
});
exports.sendSOS = sendSOS;
// Me User 
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(req.user.id)
            .select("name email phone role vehicle ");
        if (!user)
            return res.status(404).json({ success: false, message: "User not found" });
        return res.json({ success: true, user });
    }
    catch (e) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.me = me;
const isProd = process.env.NODE_ENV === "production";
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("access-token", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
    });
    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});
exports.logout = logout;
