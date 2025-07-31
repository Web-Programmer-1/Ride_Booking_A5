import mongoose, { Schema } from "mongoose";
import { IUser } from "./user.interface";


const userSchema = new Schema<IUser>({
    name: {
        type: String,
        trim:true,
        required:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password: {
        type: String,
        required:true
    },
    role:{
        type:String,
        enum:['admin', 'rider', 'driver'],
        required:true
    },
    isAvailable: {
        type:Boolean,
        default:false
    },
    approved:{
        type:Boolean,
        default:false,
    }
}, {
    versionKey:false,
    timestamps:true
});

export const User = mongoose.model("User", userSchema);