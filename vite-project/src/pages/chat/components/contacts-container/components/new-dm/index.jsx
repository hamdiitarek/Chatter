import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import apiclient from "@/lib/api_client";
import { HOST, SEARCH_CONTACTS_ROUTES } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UseAppStore from "@/store";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const NewDM = () => {
  const { setSelectedChatType, setSelectedChatData } = UseAppStore();
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const token = localStorage.getItem('token');
  const inputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (openNewContactModal && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [openNewContactModal]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchTerm.length > 0) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(() => {
        searchContacts(searchTerm);
      }, 300);
    } else {
      setSearchedContacts([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const searchContacts = async (term) => {
    try {
      const response = await apiclient.post(
        SEARCH_CONTACTS_ROUTES,
        { searchTerm: term },
        { 
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      if (response.status === 200 && response.data.contacts) {
        setSearchedContacts(response.data.contacts);
      }
    } catch (error) {
      toast.error("Failed to search contacts");
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectNewContact = (contact) => {
    setOpenNewContactModal(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchTerm("");
    setSearchedContacts([]);
  };

  return (
    <>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="p-1 sm:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setOpenNewContactModal(true)}
              aria-label="Start new conversation"
            >
              <FaPlus className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-base sm:text-lg" />
            </button>
          </TooltipTrigger>
          <TooltipContent 
            side="right"
            className="bg-gray-800 dark:bg-gray-700 border-none p-2 text-white text-xs sm:text-sm"
          >
            New Conversation
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white w-[95vw] max-w-[400px] h-[80vh] max-h-[500px] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-lg font-semibold">
              Start New Conversation
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
              Search for contacts to message
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 pt-2 pb-4">
            <div className="relative">
              <Input
                ref={inputRef}
                placeholder="Search by name or email"
                className="rounded-lg p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-teal-500"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />
              )}
            </div>
          </div>

          <ScrollArea className="flex-1 px-4">
            {searchedContacts.length > 0 ? (
              <div className="flex flex-col gap-2 pb-4">
                {searchedContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="flex gap-3 items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => selectNewContact(contact)}
                  >
                    <Avatar className="h-10 w-10">
                      {contact.profilePic ? (
                        <AvatarImage
                          src={`${HOST}/${contact.profilePic}`}
                          alt={contact.firstName || contact.email}
                          className="object-cover"
                        />
                      ) : null}
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
                        {contact.firstName 
                          ? contact.firstName.charAt(0).toUpperCase()
                          : contact.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm">
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : contact.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{contact.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 py-8">
                {searchTerm.length > 0 ? (
                  isSearching ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <p className="text-sm">No contacts found</p>
                      <p className="text-xs mt-1">Try a different search term</p>
                    </>
                  )
                ) : (
                  <>
                    <p className="text-sm">Search for contacts</p>
                    <p className="text-xs mt-1">Enter a name or email above</p>
                  </>
                )}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;