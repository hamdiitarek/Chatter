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

export const description =
  "A forgot password form that allows the user to recover their account using their email address.";

export default function Forgot() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label className="text-left" htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Remembered your password?{" "}
          <Link to="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
