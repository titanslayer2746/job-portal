import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (req,res)=>{
    try {
        const {fullname,email,phoneNumber,password,role} = req.body;
        if(!fullname || !email || !phoneNumber || !password || !role){
            return res.status(400).json({message:"something is missing"})
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"user already exists"})
        }
        if(password.length < 6){
            return res.status(400).json({message:"password must be at least 6 characters"})
        }

        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            fullname,
            email,
            phoneNumber,
            password:hashedPassword,
            role,
        })

        return res.status(201).json({message:"account created successfully",success:true})

    } catch (error) {
        console.log(error)
    }
}

const login = async (req,res)=>{
    try {
        const {email,password,role} = req.body;
        if(!email || !password || !role){
            return res.status(400).json({message:"something is missing"})
        }

        const user = await User.find({email});
        if(!user){
            return res.status(400).json({message:"user not found"})
        }

        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({message:"password is incorrect"})
        }

        if(role !== user.role){
            return res.status(400).json({message:"account doesn't exist with current role"})
        }

        const tokenData = {
            userId : user._id,
        }

        const token = jwt.sign(tokenData,process.env.JWT_SECRET_KEY,{expiresIn:'1d'});

        user = {
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }

        return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpsOnly:true,sameSite:'strict'}).json({
            message: `Welcome Back ${user.fullname}`,
            user,
            success : true
        })

    } catch (error) {
        console.log(error)
    }
}

const logout = async (req,res)=>{
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"logout successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

const updateProfile = async (req,res) =>{
    try {
        const {fullname,email,phoneNumber,bio,skills} = req.body; 
        
        const file = req.file
        if(!fullname || !email || !phoneNumber || !bio || !skills){
            return res.status(400).json({message:"something is missing",success:false})
        }
    
        //TODO : Cloudinary upload for resume and profile photo
    
        const skillsArray = skills.split(",")
        const userId = req.id;//middleware authentication
        let user = await User.findById(userId);
        if(!user){
            return res.status(400).json({message:"user not found",success:false})
        }
    
        //updating data
        user.fullname = fullname;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.profile.bio = bio;
        user.profile.skills = skillsArray;
    
        //TODO : upload resume and profile photo
    
        await user.save();
    
        user = {
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }
    
        return res.status(200).json({
            message:"profile updated successfully",
            user,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

export {
    register,
    login,
    logout,
    updateProfile
}