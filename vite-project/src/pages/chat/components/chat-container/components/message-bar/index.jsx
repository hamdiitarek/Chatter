import { useSocket } from "@/context/SocketContext";
import apiclient from "@/lib/api_client";
import UseAppStore from "@/store";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import { toast } from "sonner";

const MessageBar = () => {
  const emojiRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
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

  // Handle outside clicks for emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Enter key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !emojiPickerOpen) {
        handleSendMessage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [message, emojiPickerOpen]);

  const handleAddEmoji = (emoji) => {
    setMessage(prev => prev + emoji.emoji);
    inputRef.current?.focus();
  };

  const handleSendMessage = useCallback(async () => {
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

    try {
      if (selectedChatType === "contact") {
        messagePayload.recipient = selectedChatData._id;
        socket.emit("sendMessage", messagePayload);
      } else if (selectedChatType === "channel") {
        messagePayload.channelId = selectedChatData._id;
        socket.emit("send-channel-message", messagePayload);
      }
      setMessage("");
      inputRef.current?.focus();
    } catch (error) {
      toast.error("Failed to send message");
    }
  }, [message, selectedChatType, selectedChatData, socket, userInfo.id]);

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleAttachmentChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (e.g., 10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      setIsUploading(true);
      setFileUploadProgress(0);

      const response = await apiclient.post(UPLOAD_FILE_ROUTE, formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (data) => {
          setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
        },
      });

      if (response.status === 200 && response.data?.filePath) {
        const filePayload = {
          sender: userInfo.id,
          content: file.name,
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
    } catch (error) {
      toast.error("Failed to upload file");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="h-[10vh] min-h-[80px] bg-[#1c1d25] flex justify-between items-center px-3 sm:px-5 md:px-6 gap-3 border-t border-gray-700">
      <div className="flex-1 flex items-center bg-[#2a2b33] rounded-full p-1 gap-2 sm:gap-3">
        <input
          ref={inputRef}
          className="flex-1 bg-transparent text-white px-4 py-2 focus:outline-none text-sm sm:text-base"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-label="Message input"
        />
        
        <div className="flex items-center gap-1 sm:gap-2 pr-2">
          <button
            className="text-gray-400 hover:text-white transition p-2 rounded-full"
            onClick={handleAttachmentClick}
            aria-label="Attach file"
          >
            <GrAttachment className="text-lg sm:text-xl" />
          </button>
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleAttachmentChange}
            accept="image/*, video/*, audio/*, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt"
          />
          
          <div className="relative">
            <button
              className="text-gray-400 hover:text-white transition p-2 rounded-full"
              onClick={() => setEmojiPickerOpen(prev => !prev)}
              aria-label="Open emoji picker"
            >
              <RiEmojiStickerLine className="text-lg sm:text-xl" />
            </button>
            {emojiPickerOpen && (
              <div className="absolute bottom-12 right-0 z-50" ref={emojiRef}>
                <EmojiPicker
                  width={300}
                  height={400}
                  theme="dark"
                  onEmojiClick={handleAddEmoji}
                  autoFocusSearch={false}
                  previewConfig={{ showPreview: false }}
                  skinTonesDisabled
                  searchDisabled={window.innerWidth < 640} // Disable search on mobile
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <button
        className={`rounded-full p-3 flex items-center justify-center transition ${
          message.trim() 
            ? "bg-teal-600 hover:bg-teal-500" 
            : "bg-gray-600 cursor-not-allowed"
        }`}
        onClick={handleSendMessage}
        disabled={!message.trim()}
        aria-label="Send message"
      >
        <IoSend className="text-lg sm:text-xl" />
      </button>
    </div>
  );
};

export default MessageBar;