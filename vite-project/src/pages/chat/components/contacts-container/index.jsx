import { useEffect, useState } from "react";
import NewDM from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import apiclient from "@/lib/api_client";
import { GET_DM_CONTACTS_ROUTES, GET_USER_CHANNELS_ROUTE } from "@/utils/constants";
import UseAppStore from "@/store";
import ContactList from "@/components/contact-list";
import CreateChannel from "./components/create-channel";
import logo from "@/components/logo.png";
import { FiMenu, FiX } from "react-icons/fi";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/use-media-query";

const ContactsContainer = () => {
  const { 
    setDirectMessagesContacts, 
    directMessagesContacts, 
    channels, 
    setChannels,
    selectedChatType
  } = UseAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const [contactsRes, channelsRes] = await Promise.all([
          apiclient.get(GET_DM_CONTACTS_ROUTES, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }),
          apiclient.get(GET_USER_CHANNELS_ROUTE, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        if (contactsRes.data?.contacts) {
          setDirectMessagesContacts(contactsRes.data.contacts);
        }
        if (channelsRes.data?.channels) {
          setChannels(channelsRes.data.channels);
        }
      } catch (error) {
        toast.error("Failed to load contacts");
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setChannels, setDirectMessagesContacts]);

  useEffect(() => {
    if (isMobile && selectedChatType) {
      setIsMenuOpen(false);
    }
  }, [selectedChatType, isMobile]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (isMobile) {
    return (
      <>
        {!isMenuOpen && (
          <button 
            onClick={toggleMenu}
            className="fixed bottom-4 left-4 z-50 bg-teal-600 text-white p-3 rounded-full shadow-lg"
            aria-label="Open contacts"
          >
            <FiMenu size={24} />
          </button>
        )}

        {isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-gray-100 dark:bg-gray-900 flex flex-col">
            <div className="flex justify-end p-4">
              <button 
                onClick={toggleMenu}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="Close contacts"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="pt-3 px-6">
              <img src={logo} alt="Logo" className="h-12 sm:h-16 mx-auto dark:invert" />
            </div>

            <div className="my-4 px-4 flex-1 overflow-y-auto">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h6 className="uppercase tracking-widest text-gray-500 dark:text-gray-400 font-medium text-xs">
                    Direct Messages
                  </h6>
                  <NewDM />
                </div>
                {isLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-12" />
                    ))}
                  </div>
                ) : (
                  <ContactList contacts={directMessagesContacts} />
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h6 className="uppercase tracking-widest text-gray-500 dark:text-gray-400 font-medium text-xs">
                    Channels
                  </h6>
                  <CreateChannel />
                </div>
                {isLoading ? (
                  <div className="space-y-2">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-12" />
                    ))}
                  </div>
                ) : (
                  <ContactList contacts={channels} isChannel={true} />
                )}
              </div>
            </div>

            <div className="px-4 pb-4">
              <ProfileInfo />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="w-full md:w-80 lg:w-96 h-full bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="pt-3 px-6">
        <img src={logo} alt="Logo" className="h-12 sm:h-16 mx-auto dark:invert" />
      </div>

      <div className="my-4 px-4 flex-1 overflow-y-auto">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h6 className="uppercase tracking-widest text-gray-500 dark:text-gray-400 font-medium text-xs">
              Direct Messages
            </h6>
            <NewDM />
          </div>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-12" />
              ))}
            </div>
          ) : (
            <ContactList contacts={directMessagesContacts} />
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h6 className="uppercase tracking-widest text-gray-500 dark:text-gray-400 font-medium text-xs">
              Channels
            </h6>
            <CreateChannel />
          </div>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-12" />
              ))}
            </div>
          ) : (
            <ContactList contacts={channels} isChannel={true} />
          )}
        </div>
      </div>

      <div className="px-4 pb-4">
        <ProfileInfo />
      </div>
    </div>
  );
};

export default ContactsContainer;