import { Avatar, AvatarImage } from "@/components/ui/avatar";
import UseAppStore from "@/store";
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = UseAppStore();

  return (
    <div className="h-[10vh] min-h-[60px] border-b border-[#2f303b] flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 bg-[#1e1f26]">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative w-10 h-10 sm:w-12 sm:h-12">
          {selectedChatType === "contact" ? (
            <Avatar className="h-full w-full rounded-full overflow-hidden">
              {selectedChatData.profilePic ? (
                <AvatarImage
                  src={`${HOST}/${selectedChatData.profilePic}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div className="uppercase h-full w-full text-lg border border-gray-600 flex items-center justify-center rounded-full bg-gray-700 text-white">
                  {selectedChatData.firstName 
                    ? selectedChatData.firstName.charAt(0) 
                    : selectedChatData.email.charAt(0)}
                </div>
              )}
            </Avatar>
          ) : (
            <div className="bg-[#ffffff22] h-full w-full flex items-center justify-center rounded-full text-white text-xl sm:text-2xl">
              #
            </div>
          )}
        </div>
        <div className="text-white max-w-[180px] sm:max-w-[220px] md:max-w-[300px] truncate">
          {selectedChatType === "channel" && selectedChatData.name}
          {selectedChatType === "contact" && (
            <>
              {selectedChatData.firstName
                ? `${selectedChatData.firstName} ${selectedChatData.lastName || ''}`
                : selectedChatData.email}
            </>
          )}
        </div>
      </div>

      <button
        className="text-neutral-400 hover:text-white focus:outline-none transition duration-200 p-1 sm:p-2"
        onClick={closeChat}
        aria-label="Close chat"
      >
        <RiCloseFill className="text-2xl sm:text-3xl" />
      </button>
    </div>
  );
};

export default ChatHeader;