import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    // Validate input
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({ email, password: hashedPassword, fullName });

    if (newUser) {
      // generate jwt
      generateToken(newUser._id, res);
      await newUser.save();

      return res.status(201).json({
        message: "User registered successfully",
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "User registration failed" });
    }
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // generate jwt
    generateToken(user._id, res);
    return res.status(200).json({
      message: "User logged in successfully",
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie("jwt");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName, note } = req.body;
    const userId = req.user._id;
    let newProfilePic = req.user.profilePic;
    let input = {};

    if (!profilePic && !fullName && !note) {
      return res
        .status(400)
        .json({ message: "Profile picture, full name, or status is required" });
    }

    // Upload the new profile picture to Cloudinary
    if (profilePic) {
      const result = await cloudinary.uploader.upload(profilePic, {
        folder: "tingting/profile_pics",
      });
      newProfilePic = result.secure_url;
      input.profilePic = newProfilePic;
    }

    if (req.user.fullName !== fullName) {
      input.fullName = fullName;
    }

    if (req.user.note !== note) {
      input.note = note;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, input, {
      new: true,
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.error("Check auth error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
