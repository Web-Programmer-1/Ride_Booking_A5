"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const userRouter = express_1.default.Router();
userRouter.post("/register", user_controller_1.register);
userRouter.get("/profile/:id", user_controller_1.getUserProfile);
userRouter.post("/login", user_controller_1.login);
userRouter.post("/logout", user_controller_1.logout);
// user.route.ts
const user_controller_2 = require("./user.controller");
userRouter.get("/me", auth_middleware_1.authGuard, (0, role_middleware_1.checkRole)(["admin", "rider", "driver"]), user_controller_2.me);
// Update Profile
userRouter.patch("/profile", auth_middleware_1.authGuard, user_controller_1.updateProfile);
userRouter.post("/emergency-contact", auth_middleware_1.authGuard, user_controller_1.saveEmergencyContact);
userRouter.post("/sos", auth_middleware_1.authGuard, user_controller_1.sendSOS);
exports.default = userRouter;
