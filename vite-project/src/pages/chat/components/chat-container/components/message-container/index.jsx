import apiclient from "@/lib/api_client";
import UseAppStore from "@/store";
import {
  GET_ALL_MESSAGES_ROUTES,
  GET_CHANNEL_MESSAGES,
  HOST,
} from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState, useCallback } from "react";
import { MdFolderZip, MdImage } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const MessageContainer = () => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const {
    userInfo,
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    setIsDownloading,
    setFileDownloadProgress,
  } = UseAppStore();

  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch messages with error handling
  const fetchMessages = useCallback(async () => {
    if (!selectedChatData?._id) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const endpoint = selectedChatType === "contact" 
        ? GET_ALL_MESSAGES_ROUTES 
        : `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`;
      
      const method = selectedChatType === "contact" ? 'post' : 'get';
      const payload = selectedChatType === "contact" 
        ? { id: selectedChatData._id } 
        : undefined;

      const response = await apiclient[method](endpoint, payload, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.messages) {
        setSelectedChatMessages(response.data.messages);
      }
    } catch (error) {
      toast.error("Failed to load messages");
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  // Auto-scroll to bottom and fetch messages on mount/update
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // File type checking
  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  // File download handler
  const downloadFile = async (url) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);

    try {
      const token = localStorage.getItem("token");
      const response = await apiclient.get(`${HOST}/${url}`, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setFileDownloadProgress(percent);
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const blobUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", url.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Clean up
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
      toast.success("Download completed");
    } catch (error) {
      toast.error("Download failed");
      console.error("Download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  // DM Message Bubble Component
  const DMMessageBubble = ({ message }) => (
    <div
      className={`flex ${
        message.sender === selectedChatData._id 
          ? "justify-start" 
          : "justify-end"
      } mb-2`}
    >
      <div
        className={`relative p-3 rounded-2xl max-w-[85%] sm:max-w-[70%] break-words ${
          message.sender === selectedChatData._id
            ? "bg-[#3b3b46] text-white"
            : "bg-teal-600 text-white"
        } shadow-md`}
      >
        {message.messageType === "text" ? (
          <p className="text-sm sm:text-base">{message.content}</p>
        ) : (
          <div className="flex flex-col gap-2">
            {checkIfImage(message.fileUrl) ? (
              <>
                <div className="relative group">
                  <img
                    src={`${HOST}/${message.fileUrl}`}
                    className="rounded-lg max-h-60 object-cover w-full cursor-pointer"
                    alt="Shared content"
                    onClick={() => {
                      setShowImage(true);
                      setImageURL(message.fileUrl);
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <MdImage className="text-white text-2xl" />
                  </div>
                </div>
                <span className="text-xs text-white/70">
                  {message.fileUrl.split("/").pop()}
                </span>
              </>
            ) : (
              <div className="flex items-center gap-3 p-2 bg-black/20 rounded-lg">
                <MdFolderZip className="text-2xl flex-shrink-0" />
                <span className="text-sm truncate flex-grow">
                  {message.fileUrl.split("/").pop()}
                </span>
                <button 
                  onClick={() => downloadFile(message.fileUrl)}
                  className="p-2 rounded-full hover:bg-black/30 transition"
                  aria-label="Download file"
                >
                  <IoMdArrowRoundDown className="text-xl" />
                </button>
              </div>
            )}
          </div>
        )}
        <span className="text-xs opacity-70 block text-right mt-1">
          {moment(message.timestamp).format("h:mm A")}
        </span>
      </div>
    </div>
  );

  // Channel Message Bubble Component
  const ChannelMessageBubble = ({ message }) => (
    <div
      className={`flex ${
        message.sender._id === userInfo.id ? "justify-end" : "justify-start"
      } mb-3`}
    >
      <div className="max-w-[85%] sm:max-w-[70%]">
        {message.sender._id !== userInfo.id && (
          <div className="flex items-center gap-2 mb-1">
            <Avatar className="h-6 w-6">
              <AvatarImage 
                src={message.sender.profilePic && `${HOST}/${message.sender.profilePic}`} 
              />
              <AvatarFallback className="text-xs">
                {message.sender.firstName?.charAt(0) || message.sender.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">
              {message.sender.firstName || message.sender.email.split('@')[0]}
            </span>
          </div>
        )}
        <div
          className={`relative p-3 rounded-xl ${
            message.sender._id === userInfo.id
              ? "bg-[#6C63FF] text-white"
              : "bg-gray-200 text-gray-800"
          } shadow-md`}
        >
          {message.messageType === "text" ? (
            <p className="text-sm sm:text-base">{message.content}</p>
          ) : (
            <div className="flex flex-col gap-2">
              {checkIfImage(message.fileUrl) ? (
                <>
                  <div className="relative group">
                    <img
                      src={`${HOST}/${message.fileUrl}`}
                      className="rounded-lg max-h-60 object-cover w-full cursor-pointer"
                      alt="Shared content"
                      onClick={() => {
                        setShowImage(true);
                        setImageURL(message.fileUrl);
                      }}
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <MdImage className="text-white text-2xl" />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {message.fileUrl.split("/").pop()}
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-3 p-2 bg-black/10 rounded-lg">
                  <MdFolderZip className="text-2xl flex-shrink-0" />
                  <span className="text-sm truncate flex-grow">
                    {message.fileUrl.split("/").pop()}
                  </span>
                  <button 
                    onClick={() => downloadFile(message.fileUrl)}
                    className="p-2 rounded-full hover:bg-black/20 transition"
                    aria-label="Download file"
                  >
                    <IoMdArrowRoundDown className="text-xl" />
                  </button>
                </div>
              )}
            </div>
          )}
          <span className={`text-xs block text-right mt-1 ${
            message.sender._id === userInfo.id ? 'text-white/70' : 'text-gray-500'
          }`}>
            {moment(message.timestamp).format("h:mm A")}
          </span>
        </div>
      </div>
    </div>
  );

  // Render messages with date separators
  const renderMessages = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      );
    }

    if (!selectedChatMessages?.length) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <p>No messages yet</p>
          <p className="text-sm">Start the conversation!</p>
        </div>
      );
    }

    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={`${message._id || index}`}>
          {showDate && (
            <div className="flex justify-center my-3">
              <span className="bg-gray-200 dark:bg-gray-700 text-xs px-3 py-1 rounded-full">
                {moment(message.timestamp).format("MMMM D, YYYY")}
              </span>
            </div>
          )}
          {selectedChatType === "contact" ? (
            <DMMessageBubble message={message} />
          ) : (
            <ChannelMessageBubble message={message} />
          )}
        </div>
      );
    });
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col flex-1 p-3 sm:p-4 overflow-hidden bg-gray-50 dark:bg-[#1e1f26]"
    >
      <div className="flex-1 overflow-y-auto scroll-smooth">
        {renderMessages()}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview Modal */}
      {showImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full">
            <img 
              src={`${HOST}/${imageURL}`} 
              alt="Preview" 
              className="max-h-[90vh] max-w-full object-contain"
            />
            <button
              className="absolute top-2 right-2 bg-white/90 text-black rounded-full p-1 hover:bg-white transition"
              onClick={() => setShowImage(false)}
              aria-label="Close preview"
            >
              <IoCloseSharp size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;