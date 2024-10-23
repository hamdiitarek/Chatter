import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useState } from 'react';
import { toast } from "sonner";
import apiclient from "@/lib/api_client";
import { Signup_Route } from "@/utils/constants";
import  UseAppStore from "@/store"; // Import the Zustand store

export const description =
  "A sign up form with first name, last name, email, and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account";

export default function Signup() {
  // State declarations
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); 
  const navigate = useNavigate(); // Initialize navigate
  const setUserInfo = UseAppStore((state) => state.setUserInfo); // Get the setUserInfo function from the store

  // Validation function
  const validateSignup = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format.");
      return false;
    }
    if (!firstName.length) {
      toast.error("First name is required.");
      return false;
    }
    if (!lastName.length) {
      toast.error("Last name is required.");
      return false;
    }
    if (!phone.length) {
      toast.error("Phone number is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }

    return true;
  };

  // Handle signup
  const handleSignup = async () => {
    if (await validateSignup()) {
      try {
        const response = await apiclient.post(Signup_Route, {
          email,
          password,
          firstName,
          lastName,
          phone,
        }, { withCredentials: true });

        console.log('Signup successful:', response.data);
        toast.success('Signup successful!');

        if (response.status === 201) {
          // Set userInfo in the Zustand store
          setUserInfo(response.data); // Assuming response.data contains user information

          // Redirect to profile or another appropriate page
          navigate("/profile"); // Change to your desired route
        }
      } catch (error) {
        if (error.response) {
          console.error('Signup failed:', error.response.data);
          toast.error(error.response.data); // Show error to the user
        } else {
          console.error('Signup error:', error.message);
          toast.error('An unexpected error occurred.'); // Generic error message
        }
      }
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-left" htmlFor="first-name">First name</Label>
              <Input
                id="first-name"
                placeholder="Max"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-left" htmlFor="last-name">Last name</Label>
              <Input
                id="last-name"
                placeholder="Mustermann"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="text-left" htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <PhoneInput
                country={'eg'}
                value={phone}
                onChange={setPhone}
                inputProps={{
                  name: 'phone',
                  required: true,
                  autoFocus: true,
                }}
                specialLabel={null}
                containerClass="w-full"
                inputClass="w-full border border-gray-300 rounded-md p-2 bg-white text-black focus:ring-2 focus:ring-blue-500"
                buttonStyle={{
                  backgroundColor: 'white',
                  borderRight: '1px solid #D1D5DB',
                }}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="text-left" htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-left" htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="button" className="w-full" onClick={handleSignup}>
            Create an account
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
