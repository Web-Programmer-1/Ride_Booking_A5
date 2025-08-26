
import express from "express";
import {  getUserProfile, login, logout, register, saveEmergencyContact, sendSOS, updateProfile } from "./user.controller";
import { authGuard, AuthRequest } from "../../middlewares/auth.middleware";
import { checkRole } from "../../middlewares/role.middleware";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.get("/profile/:id", getUserProfile)


userRouter.post("/login", login);
userRouter.post("/logout", logout);

// user.route.ts
import { me } from "./user.controller";

userRouter.get(
  "/me",
  authGuard,
  checkRole(["admin", "rider", "driver"]),
  me
);


// Update Profile

userRouter.patch(
  "/profile",
  authGuard,
 
  updateProfile
);


userRouter.post("/emergency-contact", authGuard, saveEmergencyContact);
userRouter.post("/sos", authGuard, sendSOS);

export default userRouter;
