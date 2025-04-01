import ChatHeader from "./components/chat-header";
import MessageBar from "./components/message-bar";
import MessageContainer from "./components/message-container";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatContainer = () => {
  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 h-screen">
      <ChatHeader />
      <ScrollArea className="flex-1 overflow-auto">
        <MessageContainer />
      </ScrollArea>
      <div className="sticky bottom-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <MessageBar />
      </div>
    </div>
  );
};

export default ChatContainer;