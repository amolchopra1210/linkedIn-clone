import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import { sendWelcomeMail } from "../emails/emailHandlers.js";

export const signup = async (req,res) => {
    try {
        const {name, username, email, password} = req.body;
        const existingEmail = await User.findOne({email});

        if(!name || !email || !username || !password) {
            return res.status(400).json({message: "All fields are required"});
        }
        if(existingEmail) {
            return res.status(400).json({message: "Email already exists"});
        }
        const existingUsername = await User.findOne({username});
        if(existingUsername) {
            return res.status(400).json({message: "Username already exists"});
        }
        if(password.length < 6) {
            return res.status(400).json({message: "Password must be atleast 6 characters"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); //hash the password
        const user = new User({ //create user
            name,
            email,
            username,
            password: hashedPassword
        })
        await user.save(); //save user
        const token = jwt.sign({
            userId: user._id
        }, process.env.SECRET_KEY, {expiresIn: '3d'});

        res.cookie("jwt-linkedin", token, {
            httpOnly:true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV == "production",
        })
        res.status(201).json({message: "User generated successfully"})

        const profileUrl = process.env.CLIENT_URL + '/profile/' + user.username;
        
        // try {
        //     await sendWelcomeMail(user.email, user.name, profileUrl);
        // } catch (error) {
        //     console.log("Error", error.message)
        //     res.status(500).json({message: "Error in sending mail"});
        // }
    } catch (error) {
            console.log("Error", error.message)
            res.status(500).json({message: "Internal server error"});
        }
}
export const login = async (req,res) => {

    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user) {
            return res.status(400).json({message: "Invalid credentials"})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message: "Passwords do not match"})
        }
        const token = jwt.sign({
            userId: user._id
        }, process.env.SECRET_KEY, {expiresIn: '3d'});
    
        res.cookie("jwt-linkedin", token, {
            httpOnly:true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV == "production",
        }) 
        res.json({message: "Logged in successfully"})
    } catch (error) {
        console.log("Error", error.message)
        throw error
    }
   
}
export const logout = (_,res) => {
    try {
        res.clearCookie("jwt-linkedin");
        res.json({message: "Logged out successfully"})
    } catch (error) {
        console.log("Error", error.message)
        throw error
    }
}

export const getCurrentUser = async (req,res) => {
    try {
        res.json(req.user)
    } catch (error) {
        console.log("Error", error.message)
        throw error
    }
}