
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";


const generateToken = (userId, email)=>{
    return jwt.sign({userId, email}, process.env.JWT_SECRET, {expiresIn: "3d"});
}

const signup = async(req, res)=>{
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({
                success: false,
                message: "User already exists",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if(newUser){
            const token = generateToken(newUser._id, newUser.email);
            
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                maxAge: 3 * 24 * 60 * 60 * 1000,
                sameSite: "strict",
            })

            res.status(201).json({
                success: true,
                message: "User created successfully",
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                },
            })
        }
            
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        })
    }
}

const login = async(req, res)=>{
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User does not exist",
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }

        const token = generateToken(user._id, user.email);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
        })

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        })

        
            
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        })
    }
}


const AuthController = {
    signup,
    login,
}

export default AuthController;