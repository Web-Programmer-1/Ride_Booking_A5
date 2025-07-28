import { Request, Response } from "express";
import { User } from "./user.model";
import bcrypt from 'bcrypt'
import { generateToken } from "../../util/jwt";
import id from "zod/v4/locales/id.cjs";


export const register = async (req:Request, res:Response) => {
    try {
        
        const {name, email, password, role } = req.body;

        const existingUser= await User.findOne({email:email});

        if(existingUser){
           return res.json({
            message:"Email Already Exiting"
           });
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name:name,
            email:email,
            password:hashedPassword,
            role:role,
        });

        res.status(201).json({
            sucess:true,
            message:"User created Sucessfully",
            data:user
        });






    } catch (error) {
        console.log(error)
        
    }
};


export const login = async (req:Request, res:Response) => {
    try {
        
        const {email, password} = req.body;
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(404).json({
                message: "Email is not found!"
            })
        };

        const isMatchPass = await bcrypt.compare(password, user.password);
        if(!isMatchPass){
            return res.json({
                message:"Pass did't match"
            })
        };

        if(user.isBlocked){
            return res.json({
                message: "User is Blocked!"
            })
        };

        const token = generateToken({
            id:user._id,
            role:user.role,
        });

        res.status(200).json({
            sucess:true,
            message:"Login sucessfully",
            token:token
        });


    } catch (error) {
        console.log(error)
        
    }

}