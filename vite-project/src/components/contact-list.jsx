import UseAppStore from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { HOST } from "@/utils/constants";
import { useMemo } from "react";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = UseAppStore();

  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => {
      const nameA = isChannel ? a.name : (a.firstName || a.email).toLowerCase();
      const nameB = isChannel ? b.name : (b.firstName || b.email).toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [contacts, isChannel]);

  const handleClick = (contact) => {
    setSelectedChatType(isChannel ? "channel" : "contact");
    setSelectedChatData(contact);
    if (selectedChatData?._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  const getDisplayName = (contact) => {
    if (isChannel) return contact.name;
    return contact.firstName 
      ? `${contact.firstName} ${contact.lastName || ''}`.trim()
      : contact.email.split('@')[0];
  };

  return (
    <div className="space-y-1">
      {sortedContacts.map((contact) => (
        <div
          key={contact._id}
          className={`px-4 py-3 transition-all duration-200 cursor-pointer rounded-lg mx-2 ${
            selectedChatData?._id === contact._id
              ? "bg-teal-600/90 text-white"
              : "hover:bg-gray-700/50 text-gray-300"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-3 items-center">
            {isChannel ? (
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-600/50 text-gray-200">
                #
              </div>
            ) : (
              <Avatar className="h-10 w-10">
                {contact.profilePic ? (
                  <AvatarImage
                    src={`${HOST}/${contact.profilePic}`}
                    alt={contact.firstName || contact.email}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="bg-gray-700 text-white uppercase">
                  {contact.firstName 
                    ? contact.firstName.charAt(0) 
                    : contact.email.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {getDisplayName(contact)}
              </p>
              {!isChannel && (
                <p className="text-xs text-gray-400 truncate">
                  {contact.email}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;