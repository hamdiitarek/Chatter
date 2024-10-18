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
    if (!userInfo.profileSetup) {
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
      // Handle response (e.g., update state with fetched contacts)
    } catch (error) {
      console.error('Error fetching contacts:', error);
      // Consider more robust error handling (e.g., display error message to user)
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
      // Handle response
    } catch (error) {
      console.error('Error fetching DM contacts:', error);
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
      // Handle response
    } catch (error) {
      console.error('Error fetching user channels:', error);
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchDMContacts();
    fetchUserChannels();
  }, []);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      {isUploading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Uploading File</h5>
          {fileUploadProgress}%
        </div>
      )}
      {isDownloading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Downloading File</h5>
          {fileDownloadProgress}%
        </div>
      )}
      <ContactsContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default Chat;