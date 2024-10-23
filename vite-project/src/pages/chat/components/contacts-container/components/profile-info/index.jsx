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
        <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-gray-900 text-gray-100">
            <div className="flex gap-3 items-center justify-center">
                <div className="w-12 h-12 relative">
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {userInfo.profilePic ? (
                            <AvatarImage src={`${HOST}/${userInfo.profilePic}`} alt="profile" className="object-cover w-full h-full bg-black" />
                        ) : (
                            <div className="uppercase h-12 w-12 text-lg border border-gray-700 flex items-center justify-center rounded-full bg-gray-700 text-white">
                                {userInfo.firstName ? userInfo.firstName.charAt(0) : userInfo.email.charAt(0)}
                            </div>
                        )}
                    </Avatar>
                </div>
                <div className="text-white font-medium">
                    {userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""}
                </div>
            </div>
            <div className="flex gap-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2 className="text-blue-400 text-xl cursor-pointer" onClick={() => navigate("/profile")} />
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 text-white border-none">
                            <p>Edit Profile</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <IoPowerSharp className="text-red-500 text-xl cursor-pointer" onClick={logOut} />
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 text-white border-none">
                            <p>Logout</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};

export default ProfileInfo;
