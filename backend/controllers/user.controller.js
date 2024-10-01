import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getSuggestedConnections = async (req,res) => {
    try {
        const currentUser = await User.findById(req.user._id).select("connections");
        //find users who are already not in connections and also dont include our own profile
        const suggestedUsers = await User.find({
            _id: {
                $ne: req.user._id, $nin: currentUser.connections
            }
        }).select("name username profilePicture headline").limit(3);
        res.json(suggestedUsers);
    } catch (error) {
        console.log("Error in getSuggestedConnections", error);
        throw error
    }
}

export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findOne({username: req.params.username}).select("-password");
        if(!user) {
            res.status(404).json({message: "User not found"});
        }
        res.json(user);
    } catch (error) {
        console.log("Error in getPublicProfile", error);
        throw error;
    }
}

export const updateProfile = async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "username",
            "headline",
            "about",
            "location",
            "profilePicture",
            "bannerImg",
            "skills",
            "experience",
            "education"
        ];

        const updatedData = {};
        for(const field of allowedFields) {
            if(req.body[field]) {
                updatedData[field] = req.body[field];
            }
        }

        if(req.body.profilePicture) {
            const result = await cloudinary.uploader.upload(req.body.profilePicture).catch(error => console.log("error"));
            updatedData['profilePicture'] = result.secure_url;
        }
        if(req.body.bannerImg) {
            const result = await cloudinary.uploader.upload(req.body.bannerImg).catch(error => console.log("error"));
            updatedData['bannerImg'] = result.secure_url;
        }
        const user = await User.findByIdAndUpdate(req.user._id, {$set: updatedData}, {new: true}).select("-password");
        res.json(user);
    } catch (error) {
        console.log("Error in getPublicProfile", error);
        throw error;
    }
}
