import { Request, Response } from "express";
import { User } from "./user.model";
import bcrypt from "bcrypt";
import { generateToken } from "../../util/jwt";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.json({
        message: "Email Already Exiting",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
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
  } catch (error) {
    console.log(error);
  }
};



export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password"); // hide password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};




export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, password } = req.body;

    const update: any = {};
    if (typeof name === "string") update.name = name;
    if (typeof phone === "string") update.phone = phone;
    if (password && password.trim()) {
      update.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.user!.id, update, {
      new: true,
      runValidators: true,
    }).select("name email phone role");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};









export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email is not found!" });
    }

    const isMatchPass = await bcrypt.compare(password, user.password);
    if (!isMatchPass) {
      return res.status(400).json({ success: false, message: "Password didn't match" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: "User is Blocked!" });
    }

    const token = generateToken({ id: user._id, role: user.role }, );

    const isProd = process.env.NODE_ENV === "production";
     const FIFTY_DAYS_MS = 50 * 24 * 60 * 60 * 1000; 
    res.cookie("access-token", token, {
      httpOnly: true,
      secure: isProd,          
        sameSite: isProd ? "none" : "lax",      
           
      path: "/",
      maxAge:FIFTY_DAYS_MS, 
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
     
      email: user.email,
      role: user.role,
      user: { id: user._id, role: user.role, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Login failed", error });
  }
};






export const saveEmergencyContact = async (req: AuthRequest, res: Response) => {
  try {
    const { contact } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.emergencyContact = contact;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Emergency contact saved successfully",
      data: { emergencyContact: user.emergencyContact },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to save emergency contact",
      error: err,
    });
  }
};

// SMS

export const sendSOS = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
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
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to send SOS",
      error: err,
    });
  }
};



// Me User 



export const me = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.id)
      .select("name email phone role vehicle "); 
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, user });
  } catch (e) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



const isProd = process.env.NODE_ENV === "production";

export const logout = async (req: Request, res: Response) => {
  
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
};

