import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseAppStore } from "@/store";
import { Avatar } from "@/components/ui/avatar";
import { FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "sonner";
import { UPDATE_PROFILE_ROUTE, Update_Profile_Image_Route, HOST, Delete_Profile_Image_Route } from "@/utils/constants";
import apiclient from "@/lib/api_client";

export default function Profile() {
  const { userInfo, setUserInfo } = UseAppStore(); // Fetch user info from Zustand store
  const [firstName, setFirstName] = useState(userInfo?.firstName || "");
  const [lastName, setLastName] = useState(userInfo?.lastName || "");
  const [image, setImage] = useState(userInfo?.profilePic ? `${HOST}/${userInfo.profilePic}` : null);
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const [hovered, setHovered] = useState(false);
  const fileUploadRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      // Re-sync the form state with the updated userInfo
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
        const token = localStorage.getItem("token");
        const response = await apiclient.post(UPDATE_PROFILE_ROUTE, { firstName, lastName }, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile updated successfully.");
          navigate("/chat");
        }
      } catch (error) {
        console.error("Error saving profile:", error);
        toast.error("Error saving profile.");
      }
    }
  };

  const handleFileInputClick = () => {
    fileUploadRef.current.click();
  };

  const handleProfileImageUpload = async (event) => {
    setIsLoading(true); // Start loading
    const formData = new FormData();
    formData.append("profile-image", event.target.files[0]);

    try {
      const response = await apiclient.post(Update_Profile_Image_Route, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      const updatedUserInfo = { ...userInfo, profilePic: response.data.image };

      // Immediately update local state to reflect changes in the UI
      setUserInfo(updatedUserInfo);
      setFirstName(updatedUserInfo.firstName); // Ensure immediate re-sync of other fields
      setLastName(updatedUserInfo.lastName);
      setImage(`${HOST}/${updatedUserInfo.profilePic}`);

      toast.success("Profile image updated successfully.");
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Failed to upload profile image.");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleProfileImageDelete = async () => {
    setIsLoading(true); // Start loading
    try {
      await apiclient.delete(Delete_Profile_Image_Route, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const updatedUserInfo = { ...userInfo, profilePic: null };

      // Immediately update local state to reflect changes in the UI
      setUserInfo(updatedUserInfo);
      setFirstName(updatedUserInfo.firstName);
      setLastName(updatedUserInfo.lastName);
      setImage(null);

      toast.success("Profile image removed successfully.");
    } catch (error) {
      console.error("Error deleting profile image:", error);
      toast.error("Failed to delete profile image.");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Profile</CardTitle>
        <CardDescription>Update your profile information below.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {/* Profile Avatar */}
          <div
            className="relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 rounded-full overflow-hidden bg-gray-500 text-white flex items-center justify-center">
              {isLoading ? (
                <div className="loader"></div> // Show loader while loading
              ) : image ? (
                <img src={image} alt="profile" className="object-cover w-full h-full" />
              ) : (
                <span className="text-5xl">
                  {firstName || lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}` : "N/A"}
                </span>
              )}
            </Avatar>
            {hovered && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer" onClick={image ? handleProfileImageDelete : handleFileInputClick}>
                {image ? <FaTrash className="text-white text-3xl" /> : <FaPlus className="text-white text-3xl" />}
              </div>
            )}
          </div>
          <input type="file" ref={fileUploadRef} className="hidden" onChange={handleProfileImageUpload} name="profile-image" accept=".png, .jpeg, .jpg, .svg, .webp" />

          {/* Input fields */}
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-left">Email</Label>
            <Input
              id="email"
              type="email"
              value={userInfo.email || ""}
              disabled
              className="p-6 bg-[#2c2e3b] text-white"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="firstName" className="text-left">First Name</Label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="p-6 bg-[#2c2e3b] text-white"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName" className="text-left">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="p-6 bg-[#2c2e3b] text-white"
            />
          </div>
          <Button type="button" className="w-full bg-green-700" onClick={saveChanges}>
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
``
