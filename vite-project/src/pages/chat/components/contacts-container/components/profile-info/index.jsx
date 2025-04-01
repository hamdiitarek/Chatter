import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import apiclient from "@/lib/api_client";
import UseAppStore from "@/store";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ProfileInfo = () => {
    const { userInfo, setUserInfo, setSelectedChatType, setSelectedChatData } = UseAppStore();
    const navigate = useNavigate();

    const logOut = async () => {
        try {
            const response = await apiclient.post(LOGOUT_ROUTE, {}, { withCredentials: true });

            if (response.status === 200) {
                localStorage.removeItem("token"); 
                navigate("/login");
                setUserInfo(null);
                setSelectedChatType(undefined);
                setSelectedChatData(undefined);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="h-16 flex items-center justify-between px-4 w-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
            <div className="flex gap-2 items-center">
                <div className="w-10 h-10 relative">
                    <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                        {userInfo?.profilePic ? (
                            <AvatarImage 
                              src={`${HOST}/${userInfo.profilePic}`} 
                              alt="profile" 
                              className="object-cover w-full h-full" 
                            />
                        ) : (
                            <div className="uppercase h-10 w-10 text-sm border border-gray-300 dark:border-gray-700 flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white">
                                {userInfo?.firstName ? userInfo.firstName.charAt(0) : userInfo?.email?.charAt(0)}
                            </div>
                        )}
                    </Avatar>
                </div>
                <div className="text-sm font-medium truncate max-w-[120px]">
                    {userInfo?.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : userInfo?.email}
                </div>
            </div>
            <div className="flex gap-3">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2 
                              className="text-blue-500 dark:text-blue-400 text-lg cursor-pointer hover:text-blue-600 dark:hover:text-blue-300" 
                              onClick={() => navigate("/profile")} 
                            />
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 dark:bg-gray-700 text-white border-none text-xs">
                            <p>Edit Profile</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <IoPowerSharp 
                              className="text-red-500 dark:text-red-400 text-lg cursor-pointer hover:text-red-600 dark:hover:text-red-300" 
                              onClick={logOut} 
                            />
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 dark:bg-gray-700 text-white border-none text-xs">
                            <p>Logout</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};

export default ProfileInfo;