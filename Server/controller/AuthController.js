import express from "express"; // Ensure express is imported correctly
import User from "../models/UserModel.js";
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import bcrypt from 'bcryptjs'; // Use default import for bcryptjs

const maxAge = 3 * 24 * 60 * 60 * 1000; // Token expiry time (3 days)

// Function to create JWT token
const createToken = (email, userId) => {
  return sign({ email, userId }, process.env.JWT_SECRET, { expiresIn: maxAge });
};

// Signup function
export const Signup = async (request, response) => {
  try {
    const { email, password, firstName, lastName, phone } = request.body;

    // Validate input
    if (!email || !password || !firstName || !lastName || !phone) {
      return response.status(400).send("All fields are required.");
    }

    console.log('Request Body:', request.body); // Log incoming request

    // Check if the user already exists by email
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return response.status(409).send("User already exists with this email.");
    }

    // Check if the user already exists by phone number
    const existingUserByPhone = await User.findOne({ phone });
    if (existingUserByPhone) {
      return response.status(409).send("User already exists with this phone number.");
    }

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Hashed Password:', hashedPassword); // Log hashed password

    // Create a new user with hashed password and salt
    const user = await User.create({
      email,
      password: hashedPassword,
      salt, // Store the salt
      firstName,
      lastName,
      phone
    });

    console.log('New user created:', user); // Log new user details

    const token = createToken(email, user._id);

    // Set the cookie with the JWT
    response.cookie("jwt", token, {
      httpOnly: true,
      maxAge,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "None"
    });

    return response.status(201).json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      createdAt: user.createdAt,
      profilePic: user.profilePic,
      profileSetup: user.profileSetup
    });
  } catch (error) {
    console.error("Signup Error: ", error);
    return response.status(500).send("Internal Server Error");
  }
};

// Login function
export const Login = async (request, response) => {
	try {
	  const { email, password } = request.body;
  
	  // Validate input
	  if (!email || !password) {
		return response.status(400).send("All fields are required.");
	  }
  
	  console.log('Request Body:', request.body); // Log incoming request
  
	  // Check if the user exists
	  const user = await User.findOne({ email });
	  if (!user) {
		console.log("User not found");
		return response.status(404).send("User doesn't exist with this email.");
	  }
  
	  console.log('User found:', user); // Log user data
  
	  // Use bcrypt's compare function to compare the input password with the stored hash
	  const auth = await bcrypt.compare(password, user.password);
	  console.log('Password comparison result:', auth);
  
	  if (!auth) {
		console.log('Password comparison failed');
		return response.status(401).json({ message: "Wrong password!" });
	  }
  
	  const token = createToken(email, user._id); // Create token after successful authentication
  
	  // Set the cookie with the JWT
	  response.cookie("jwt", token, {
		httpOnly: true,
		maxAge,
		secure: process.env.NODE_ENV === 'production',
		sameSite: "None"
	  });
  
	  return response.status(200).json({
		id: user._id,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
    phone: user.phone,
		createdAt: user.createdAt,
		profilePic: user.profilePic,
		profileSetup: user.profileSetup,
    token: token
	  });
	} catch (error) {
	  console.error("Login Error: ", error);
	  return response.status(500).send("Internal Server Error");
	}
  };
  
  export const getUserInfo = async (request, response) => {
    try {
      
    
      const userData = await User.findById(request.userId);
      if (!userData) {
        return response.status(404).send("User with the given id not found.");
      }

      return response.status(200).json({
        
          id: userData._id,
          email: userData.email,
          profileSetup: userData.profileSetup,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profilePic: userData.profilePic,
        
      });

            // return response.status(200).json({
            // id: user._id,
            // email: user.email,
            // firstName: user.firstName,
            // lastName: user.lastName,
            // phone: user.phone,
            // createdAt: user.createdAt,
            // profilePic: user.profilePic,
            // profileSetup: user.profileSetup
            // });
          } catch (error) {
            console.error("Login Error: ", error);
            return response.status(500).send("Internal 3Server Error");
          }
   };