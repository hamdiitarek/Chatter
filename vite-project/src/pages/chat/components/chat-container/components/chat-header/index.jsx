import { Avatar, AvatarImage } from "@/components/ui/avatar";
import UseAppStore from "@/store";
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = UseAppStore();

  return (
    console.log("selectedChatData", selectedChatData),
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-4 md:px-10 lg:px-20">
      {/* Adjusted padding for better responsiveness */}
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12">
          {selectedChatType === "contact" ? (
            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
              {selectedChatData.profilePic ? (
                <AvatarImage
                src={`${HOST}/${selectedChatData.profilePic}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div className="uppercase h-12 w-12 text-lg border border-gray-600 flex items-center justify-center rounded-full bg-gray-700 text-white">
                      {selectedChatData.firstName ? selectedChatData.firstName.charAt(0) : selectedChatData.email.charAt(0)}
                    </div>
              )}
            </Avatar>
          ) : (
            <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
              #
            </div>
          )}
        </div>
        <div className="text-black">
          {/* Show the appropriate name or email */}
          {selectedChatType === "channel" && selectedChatData.name}
          {selectedChatType === "contact" && (
            <>
              {selectedChatData.firstName
                ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                : selectedChatData.email}
            </>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <button
          className="text-neutral-500 hover:text-white focus:outline-none transition duration-300"
          onClick={closeChat}
        >
          <RiCloseFill className="text-3xl" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
