import UseAppStore from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ChatContainer from "./components/chat-container";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import { 
  GET_USER_CHANNELS_ROUTE, 
  GET_DM_CONTACTS_ROUTES, 
  GET_ALL_CONTACTS_ROUTES 
} from "@/utils/constants";
import apiclient from "@/lib/api_client";

const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = UseAppStore();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!userInfo?.profileSetup) {
      toast("Please setup profile to continue");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  const fetchContacts = async () => {
    try {
      await apiclient.get(GET_ALL_CONTACTS_ROUTES, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error("Failed to load contacts");
    }
  };

  const fetchDMContacts = async () => {
    try {
      await apiclient.get(GET_DM_CONTACTS_ROUTES, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error fetching DM contacts:', error);
      toast.error("Failed to load messages");
    }
  };

  const fetchUserChannels = async () => {
    try {
      await apiclient.get(GET_USER_CHANNELS_ROUTE, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error fetching user channels:', error);
      toast.error("Failed to load channels");
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchDMContacts();
    fetchUserChannels();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      <ContactsContainer />
      
      {/* Chat area */}
      <div className={`flex-1 ${selectedChatType === undefined ? 'hidden md:flex' : 'flex'}`}>
        {selectedChatType === undefined ? (
          <EmptyChatContainer />
        ) : (
          <ChatContainer />
        )}
      </div>
      
      {/* Upload overlay */}
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center flex-col gap-4 sm:gap-5 backdrop-blur-lg">
          <h5 className="text-xl sm:text-2xl md:text-4xl animate-pulse">Uploading File</h5>
          <div className="text-lg sm:text-xl md:text-2xl">{fileUploadProgress}%</div>
          <div className="w-3/4 sm:w-2/3 md:w-1/2 h-2 bg-gray-700 rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300" 
              style={{ width: `${fileUploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Download overlay */}
      {isDownloading && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center flex-col gap-4 sm:gap-5 backdrop-blur-lg">
          <h5 className="text-xl sm:text-2xl md:text-4xl animate-pulse">Downloading File</h5>
          <div className="text-lg sm:text-xl md:text-2xl">{fileDownloadProgress}%</div>
          <div className="w-3/4 sm:w-2/3 md:w-1/2 h-2 bg-gray-700 rounded-full">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-300" 
              style={{ width: `${fileDownloadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;