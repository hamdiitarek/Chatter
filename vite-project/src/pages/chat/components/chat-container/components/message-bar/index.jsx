import { useSocket } from "@/context/SocketContext";
import apiclient from "@/lib/api_client";
import UseAppStore from "@/store";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import { useRef, useState, useEffect } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import { toast } from "sonner";

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const socket = useSocket();
  const {
    userInfo,
    selectedChatType,
    selectedChatData,
    setIsUploading,
    setFileUploadProgress,
  } = UseAppStore();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const token = localStorage.getItem('token');


  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (message.trim().length === 0) {
      toast.error("Message cannot be empty");
      return;
    }

    const messagePayload = {
      sender: userInfo.id,
      content: message,
      messageType: "text",
      fileUrl: undefined,
    };

    if (selectedChatType === "contact") {
      messagePayload.recipient = selectedChatData._id;
      socket.emit("sendMessage", messagePayload);
    } else if (selectedChatType === "channel") {
      messagePayload.channelId = selectedChatData._id;
      socket.emit("send-channel-message", messagePayload);
    }

    setMessage(""); 
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);

        const response = await apiclient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
        });

        if (response.status === 200 && response.data) {
          setIsUploading(false);
          const filePayload = {
            sender: userInfo.id,
            content: undefined,
            messageType: "file",
            fileUrl: response.data.filePath,
          };

          if (selectedChatType === "contact") {
            filePayload.recipient = selectedChatData._id;
            socket.emit("sendMessage", filePayload);
          } else if (selectedChatType === "channel") {
            filePayload.channelId = selectedChatData._id;
            socket.emit("send-channel-message", filePayload);
          }
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.log("Error uploading file:", error);
    }
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-between items-center px-4 md:px-8 gap-4 mb-6">
      <div className="flex-1 flex items-center bg-[#2a2b33] rounded-md p-2 gap-3">
        <input
          className="flex-1 bg-transparent text-white p-2 rounded-md focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="text-neutral-500 hover:text-white transition duration-300"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <div className="relative">
          <button
            className="text-neutral-500 hover:text-white transition duration-300"
            onClick={() => setEmojiPickerOpen((prev) => !prev)}
          >
            <RiEmojiStickerLine className="text-xl" />
          </button>
          {emojiPickerOpen && (
            <div className="absolute bottom-12 right-0 z-10" ref={emojiRef}>
              <EmojiPicker
                theme="dark"
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>
      </div>
      <button
        className="bg-teal-900 rounded-md flex items-center justify-center p-3 hover:bg-teal-700 transition duration-300"
        onClick={handleSendMessage}
      >
        <IoSend className="text-xl" />
      </button>
    </div>
  );
};

export default MessageBar;
