import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UseAppStore from "@/store";
import { Avatar } from "@/components/ui/avatar";
import { FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "sonner";
import { UPDATE_PROFILE_ROUTE, Update_Profile_Image_Route, HOST, Delete_Profile_Image_Route } from "@/utils/constants";
import apiclient from "@/lib/api_client";

export default function Profile() {
  const { userInfo, setUserInfo } = UseAppStore();
  const [firstName, setFirstName] = useState(userInfo?.firstName || "");
  const [lastName, setLastName] = useState(userInfo?.lastName || "");
  const [image, setImage] = useState(userInfo?.profilePic ? `${HOST}/${userInfo.profilePic}` : null);
  const [isLoading, setIsLoading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const fileUploadRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.firstName || "");
      setLastName(userInfo.lastName || "");
      setImage(userInfo.profilePic ? `${HOST}/${userInfo.profilePic}` : null);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required.");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required.");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        setIsLoading(true);
        const response = await apiclient.post(
          UPDATE_PROFILE_ROUTE, 
          { firstName, lastName }, 
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          }
        );
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile updated successfully.");
          navigate("/chat");
        }
      } catch (error) {
        console.error("Error saving profile:", error);
        toast.error("Error saving profile.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleProfileImageUpload = async (event) => {
    if (!event.target.files[0]) return;
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append("profile-image", event.target.files[0]);

    try {
      const response = await apiclient.post(
        Update_Profile_Image_Route, 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      const updatedUserInfo = { ...userInfo, profilePic: response.data.image };
      setUserInfo(updatedUserInfo);
      setImage(`${HOST}/${updatedUserInfo.profilePic}`);
      toast.success("Profile image updated successfully.");
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Failed to upload profile image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileImageDelete = async () => {
    setIsLoading(true);
    try {
      await apiclient.delete(Delete_Profile_Image_Route, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedUserInfo = { ...userInfo, profilePic: null };
      setUserInfo(updatedUserInfo);
      setImage(null);
      toast.success("Profile image removed successfully.");
    } catch (error) {
      console.error("Error deleting profile image:", error);
      toast.error("Failed to delete profile image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Profile</CardTitle>
          <CardDescription>Update your profile information below.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* Profile Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div
                className="relative w-32 h-32"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <Avatar className="h-full w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center">
                  {isLoading ? (
                    <div className="animate-pulse rounded-full bg-gray-300 dark:bg-gray-600 h-full w-full"></div>
                  ) : image ? (
                    <img src={image} alt="profile" className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-5xl">
                      {firstName || lastName ? 
                        `${firstName.charAt(0)}${lastName.charAt(0)}` : 
                        "N/A"}
                    </span>
                  )}
                </Avatar>
                {hovered && !isLoading && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer" 
                    onClick={image ? handleProfileImageDelete : () => fileUploadRef.current.click()}
                  >
                    {image ? (
                      <FaTrash className="text-white text-xl" />
                    ) : (
                      <FaPlus className="text-white text-xl" />
                    )}
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileUploadRef} 
                className="hidden" 
                onChange={handleProfileImageUpload} 
                name="profile-image" 
                accept=".png, .jpeg, .jpg, .svg, .webp" 
              />
            </div>

            {/* Input fields */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userInfo?.email || ""}
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-800"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-800"
                />
              </div>
              <Button 
                type="button" 
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                onClick={saveChanges}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}