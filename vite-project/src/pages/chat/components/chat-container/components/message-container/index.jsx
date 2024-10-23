import apiclient from "@/lib/api_client";
import UseAppStore from "@/store";
import {
  GET_ALL_MESSAGES_ROUTES,
  GET_CHANNEL_MESSAGES,
  HOST,
} from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MessageContainer = () => {
  const scrollRef = useRef();
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

  useEffect(() => {
    const getMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await apiclient.post(
          GET_ALL_MESSAGES_ROUTES,
          { id: selectedChatData._id },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log({ error });
      }
    };

    const getChannelMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await apiclient.get(
          `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log({ error });
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
      else if (selectedChatType === "channel") getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const downloadFile = async (url) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);

    try {
      const token = localStorage.getItem("token");
      const response = await apiclient.get(`${HOST}/${url}`, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          setFileDownloadProgress(Math.round((100 * loaded) / total));
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", url.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setIsDownloading(false);
      setFileDownloadProgress(0);
    }
  };

  const renderDMMessages = (message) => (
    <div className={`flex ${message.sender === selectedChatData._id ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`${
          message.sender === selectedChatData._id
            ? "bg-[#3b3b46] text-white" // Darker background for incoming messages
            : "bg-teal-500 text-white" // Slightly more saturated color for sent messages
        } relative inline-block p-6 rounded-2xl my-1 max-w break-words shadow-md`} // Added shadow and padding
      >
        {message.messageType === "text" && (
          <div className="text-sm font-medium"> {/* Increased font size and weight */}
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <>
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageURL(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  className="rounded-lg" // Rounded image corners for better appearance
                  height={300}
                  width={300}
                  alt="message-file"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </>
        )}
        <div className="text-xs text-white-400 absolute bottom-1 right-3">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    </div>
  );
  
  const renderChannelMessages = (message) => (
    <div className={`flex ${message.sender._id === userInfo.id ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`${
          message.sender._id === userInfo.id
            ? "bg-[#6C63FF] text-white"
            : "bg-gray-200 text-black"
        } relative p-4 rounded-xl max-w-xs sm:max-w-md break-words shadow-md`}
      >
        {message.messageType === "text" && (
          <div>{message.content}</div>
        )}
        {message.messageType === "file" && (
          <>
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageURL(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  alt="message-file"
                  className="rounded-lg max-w-full h-auto"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <MdFolderZip className="text-2xl text-white/80" />
                <span>{message.fileUrl.split("/").pop()}</span>
                <IoMdArrowRoundDown 
                  className="text-xl cursor-pointer hover:bg-gray-700 p-2 rounded-full" 
                  onClick={() => downloadFile(message.fileUrl)} 
                />
              </div>
            )}
          </>
        )}
        <span className="text-xs text-gray-500 absolute bottom-1 right-2">
          {moment(message.timestamp).format("LT")}
        </span>
      </div>
    </div>
  );
  
  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col flex-grow p-4 overflow-hidden">
      <div className="flex flex-col overflow-y-auto max-h-full">
        {renderMessages()}
        <div ref={scrollRef} />
      </div>
      {showImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="relative">
            <img src={`${HOST}/${imageURL}`} alt="Large view" className="max-w-full max-h-full" />
            <button
              className="absolute top-2 right-2 bg-white text-red-500 rounded-full p-2"
              onClick={() => setShowImage(false)}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
