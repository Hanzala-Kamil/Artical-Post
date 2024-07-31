const jwt = require('jsonwebtoken');
const User = require('../model/authModel');
const OptUser = require('../model/OtpModel');
const mailSend = require('../sendMail/SendMail');
const Post = require('../model/createPost');
const imageData = require('../model/uploadImage')

// admin signup
const adminSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const user = new User({ name, email, password });
        const otp = Math.floor(1000 + Math.random() * 9000);
        const optUser = new OptUser({ email, otp });
        const mailResult = await mailSend(email, otp);
        if (!mailResult.success) {
            return res.status(500).json({ message: "Failed to send OTP email" });
        }
        await user.save();
        await optUser.save();
        return res.status(201).json({ message: "User created successfully, OTP sent" });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};

// verify Admin 
const AdminVerify = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ message: "User not found" });
        const userOtpDoc = await OptUser.findOne({ email: email });
        if (!userOtpDoc) return res.status(400).json({ message: "OTP not found" });
        else if (userOtpDoc.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
        else {
            user.verify = "Active";
            user.role = "Admin";
            await user.save();
            await OptUser.findOneAndDelete({ email: email });
            return res.status(200).json({ message: "User verified successfully" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Error occurred during verification" });
    }
};

// Login Admin
const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const checkUser = await User.findOne({ email: email });
        if (!checkUser) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        if (checkUser.verify === "Not Active") {
            return res.status(400).json({ message: "Your status is not Active. Please confirm OTP." })
        }
        if (checkUser.password !== password) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        if (checkUser.role !== "Admin"){
            return res.status(400).json({ message: "You are not an Admin" });
        }
        const token = jwt.sign({ userId: checkUser._id }, 'H@nzala786');

        return res.status(200).json({ message: "Login successful", token, checkUser });
    } catch (err) {
        res.status(500).json({ message: "Error occurred during login" });
    }
};

// admin get post
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('parentId').populate('imageId').populate({ path: 'comments.user', select: 'name' });
        // console.log(posts)
        if (!posts) {
            return res.status(404).json({ message: 'No post found' })
        }
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// admin delete User
const AdminDeletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.userId;
        // const userID = req.user;
        const user = await User.findById(userId);
        user.postCount -= 1;
        const post = await Post.find({ postId });
        if (!post) {
            return res.status(404).json({ message: 'No post found' })
        }
        await user.save()
        await Post.deleteOne({ postId });
        res.status(200).json({ message: 'Post deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

// admin view user
const viewAllUsers = async (req, res) => {
    try {
        const users = await Post.find().populate('parentId');
        if (!users) {
            return res.status(404).json({ message: 'No user found' })
        }
        return res.status(200).json(users)
    }catch(error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { adminSignup, AdminVerify, adminLogin, getAllPosts, AdminDeletePost ,viewAllUsers }