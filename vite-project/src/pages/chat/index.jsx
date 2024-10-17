import { UseAppStore } from "../../store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import ContactsContainer from "../chat/components/contacts container";
import EmptyChatContainer from "../chat/components/empty container";
import ChatContainer from "../chat/components/chat container";

const Chat = () => {
  const { userInfo } = UseAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please setup profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  // Assuming you have some state to determine if there are active chats
  const [hasActiveChats, setHasActiveChats] = useState(); 

  return (
    <div className="flex"> {/* Add flex to the parent */}
      <ContactsContainer />
      <div className="flex-1"> {/* Make this div take up remaining space */}
        {hasActiveChats ? (
          <ChatContainer /> 
        ) : (
          <div class="flex-1"> {/* Add flex-1 here */}
        <EmptyChatContainer /> 
    </div>
         
        )}
      </div>
    </div>
  );
};

export default Chat;