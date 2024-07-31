const jwt = require('jsonwebtoken');
const User = require('../model/authModel');
const OptUser = require('../model/OtpModel');
const mailSend = require('../sendMail/SendMail');

// Signup Users 
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        // const user = new User({ name, email, password , role:"Admin" });
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


// verify OPT
const verify = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ message: "User not found" });
        const userOtpDoc = await OptUser.findOne({ email: email });
        if (!userOtpDoc) return res.status(400).json({ message: "OTP not found" });
        else if (userOtpDoc.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
        else{
            user.verify = "Active";
            await user.save();
            await OptUser.findOneAndDelete({ email: email });
            return res.status(200).json({ message: "User verified successfully" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Error occurred during verification" });
    }
};

// Login the User
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const checkUser = await User.findOne({ email: email });
        if (!checkUser) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        if (checkUser.verify === "Not Active"){
            return res.status(400).json({ message: "Your status is not Active. Please confirm OTP." })
        }
        if (checkUser.password !== password) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // if (checkUser.role !== "user"){
        //     return res.status(400).json({ message: "NOT Access to login user account" });
        // }
        const token = jwt.sign({ userId: checkUser._id }, 'H@nzala786');
        
        return res.status(200).json({ message: "Login successful", token , checkUser });
    } catch (err) {
        res.status(500).json({ message: "Error occurred during login" });
    }
};


// login with Google

const googleLogin = async (req, res) => {
    const { token } = req.body;
    console.log(token)
    const clientToken = '409591594507-heq02m2g88aikoigsnvehsgs83msppc2.apps.googleusercontent.com'
    try {
        const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
        const userData = await res.json();
        console.log("UserData" , userData)
        console.log("UserData AZP" , userData.azp)
        if (userData.azp !== clientToken){
            return res.status(400).json({ message: 'Invalid token' });
        }   
        return res.json({ message: 'Login successful', user: userData });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { signup ,verify ,login , googleLogin };