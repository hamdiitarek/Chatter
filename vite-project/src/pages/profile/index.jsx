import { UseAppStore } from '@/store'; 
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import apiclient from '@/lib/api_client';
import { GET_USER_INFO } from '@/utils/constants';

function Profile() {
  const { userInfo, setUserInfo } = UseAppStore();
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiclient.get(GET_USER_INFO, {
          withCredentials: true,
        });
        const data = response.data;
        setUserInfo(data);
        setProfilePic(data.profilePic);
        setName(`${data.firstName} ${data.lastName}`);
        setEmail(data.email);
        setPhone(data.phone);
        setFirstName(data.firstName);
        setLastName(data.lastName);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [setUserInfo]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label className="text-left" htmlFor="profilePic">Profile Picture</Label>
            <Avatar src={profilePic} alt="Profile Picture" />
          </div>
          <div className="grid gap-2">
            <Label className="text-left" htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-left" htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-left" htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-left" htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit">Save Changes</Button>
      </CardFooter>
    </Card>
  );
}

export default Profile;