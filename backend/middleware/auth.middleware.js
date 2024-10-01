import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies["jwt-linkedin"];
        if(!token) {
            return res.status(401).json({message: "Unauthorised - No token provided"});
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(!decoded) {
            return res.status(401).json({message: "Unauthorised - Invalid token"});
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(!user) {
            return res.status(401).json({message: "User not found"});
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({message: "internal server error"});
        throw error;
    }
}