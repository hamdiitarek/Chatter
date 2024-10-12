import { Link } from "react-router-dom";
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import apiclient from "@/lib/api_client";
import { Login_Route } from "@/utils/constants";
import { UseAppStore } from "@/store"; // Import the Zustand store

export const description =
  "A login form with email and password. There's an option to login with Google and a link to sign up if you don't have an account.";


export default function Login() {
  // State hooks for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const setUserInfo = UseAppStore((state) => state.setUserInfo); // Get the setUserInfo function from the store

  // Validation function for login
  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }
    return true;
  };

  // Handle login
  const handleLogin = async () => {
    if (!validateLogin()) return;

    try {
      const response = await apiclient.post(
        Login_Route,
        { email, password },
        { withCredentials: true }
      );

      // Log the full response to check its structure
      console.log("Full response:", response);

      // Access email and profileSetup directly from response.data
      const { email: userEmail, profileSetup } = response.data;

      if (userEmail) {
        console.log("User email:", userEmail);
        // Set the userInfo in the Zustand store
        setUserInfo(response.data);
      } else {
        console.error("User email is undefined");
      }

      if (profileSetup !== undefined) {
        toast.success("Login successful!");

        // Redirect based on profile setup status
        if (profileSetup) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }
      } else {
        toast.error("Login failed. No user information returned.");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Invalid credentials.");
      } else {
        toast.error("Login failed. Please try again.");
      }
      console.error("Login error:", error);
    }
  };

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-left">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
              required
            />
          </div>
          <Button type="button" className="w-full" onClick={handleLogin}>
            Login
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}