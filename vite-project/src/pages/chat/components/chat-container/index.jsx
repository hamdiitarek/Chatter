import ChatHeader from "./components/chat-header";
import MessageBar from "./components/message-bar";
import MessageContainer from "./components/message-container";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatContainer = () => {
  return (
    <div className="fixed top-0 left-[35vw] lg:left-[30vw] xl:left-[25vw] w-[65vw] lg:w-[70vw] xl:w-[75vw] h-screen bg-neutral-50 flex flex-col"> 
      {/* Flexbox to manage column layout with full height */}
      <ChatHeader />
      <ScrollArea className="flex-grow overflow-auto">
        {/* MessageContainer takes up remaining height, allowing for scrolling */}
        <MessageContainer />
      </ScrollArea>
      <div className="sticky w-full bg-[#1c1d25]">
        {/* Sticky positioning keeps the message bar at the bottom */}
        <MessageBar />
      </div>
    </div>
  );
};

export default ChatContainer;