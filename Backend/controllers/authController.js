import bcrypt from 'bcryptjs';
import User from "../models/userModel.js";
import { generateToken } from "../utils/utils.js";

export const signup = async (req, res) => {
    const {fullName,email,password} = req.body
    try {

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        if(password.length<6){
            return res.status(400).json({msg:"Password must be at least 6 characters"})
        }
        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({message:"Email already exists"})
        }
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password,salt)

        const newUser = new User({fullName,email,password:hash})

        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
            })
        }else{
            res.status(400).json({message:"Invalid user data"})
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({message:"Internal server error"})
    }
};

export const login = async (req, res) => {
    const {email,password} = req.body
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invalid credentials"})
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"})
        }
        generateToken(user._id, res);

        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
        })
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({message:"Internal server error"})
    }
};

export const logout = (req,res)=>{
    try {
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({message:"Internal server error"});
        
    }
};