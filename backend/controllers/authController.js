import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; 
import { loginSchema, signupSchema } from "../validators/authSchema.js";
import { ZodError } from "zod";



export const signUp = async (req, res) => {
  try {

    signupSchema.parse(req.body) 

    const { name, email, password } = req.body;

    const alreadyExists = await User.findOne({ email });
    if (alreadyExists) {
      return res.status(400).json({ success: false, message: "User already exists! Please login" });
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

    return res.status(201).json({
      success: true,
      message: "User created successfully!",
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token,
    });
  } catch (err) {
       if(err instanceof ZodError){
         const message = err.errors?.[0]?.message || "Invalid input";
        return res.status(400).json({message})
       }
    console.log(err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const logIn = async (req, res) => {
  try {

    loginSchema.parse(req.body)
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log('User found:', user ? 'YES' : 'NO');
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    
    const isMatch = await bcrypt.compare(password, user.password);
    

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    console.log('PASSWORD MATCHED! LOGIN SUCCESS');
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (err) {
               
               if(err instanceof ZodError){
                 const message = err.errors?.[0]?.message || "Invalid input";
                    return res.status(400).json({message})
               }
    console.log('LOGIN ERROR:', err.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};