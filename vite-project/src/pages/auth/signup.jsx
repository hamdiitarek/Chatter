import { Link, useNavigate } from "react-router-dom";
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
import UseAppStore from "@/store";

export default function Signup() {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); 
  const navigate = useNavigate();
  const setUserInfo = UseAppStore((state) => state.setUserInfo);

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

        toast.success('Signup successful!');

        if (response.status === 201) {
          setUserInfo(response.data);
          navigate("/profile");
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message || "Signup failed");
        } else {
          toast.error('An unexpected error occurred.');
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  placeholder="Max"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
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
              <Label htmlFor="phone">Phone Number</Label>
              <PhoneInput
                country={'us'}
                value={phone}
                onChange={setPhone}
                inputProps={{
                  name: 'phone',
                  required: true,
                }}
                containerClass="w-full"
                inputClass="w-full border border-gray-300 rounded-md p-2 bg-white text-black focus:ring-2 focus:ring-blue-500"
                buttonStyle={{
                  backgroundColor: 'white',
                  borderRight: '1px solid #D1D5DB',
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="button" 
              className="w-full" 
              onClick={handleSignup}
            >
              Create an account
            </Button>
            <div className="mt-2 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline hover:text-blue-600">
                Login
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}