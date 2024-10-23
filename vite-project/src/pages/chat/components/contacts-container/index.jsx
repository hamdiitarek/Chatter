import { useEffect } from "react";
import NewDM from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import apiclient from "@/lib/api_client";
import { GET_DM_CONTACTS_ROUTES, GET_USER_CHANNELS_ROUTE } from "@/utils/constants";
import UseAppStore from "@/store";
import ContactList from "@/components/contact-list";
import CreateChannel from "./components/create-channel";
import logo from "@/components/logo.png";

const ContactsContainer = () => {
  const { setDirectMessagesContacts, directMessagesContacts, channels, setChannels } = UseAppStore();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await apiclient.get(GET_DM_CONTACTS_ROUTES, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.contacts) {
          setDirectMessagesContacts(response.data.contacts);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    const getChannels = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await apiclient.get(GET_USER_CHANNELS_ROUTE, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.channels) {
          setChannels(response.data.channels);
          console.log("Updated channels in store: ", response.data.channels); 
        }
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };
  
    getContacts();
    getChannels();
  }, [setChannels, setDirectMessagesContacts]);

  return (
    <div className="fixed top-0 left-0 w-[35vw] lg:w-[30vw] xl:w-[25vw] h-screen bg-gray-100 border-r border-gray-200 flex flex-col"> 
      <div className="pt-3">
        <img src={logo} alt="Logo" className="h-20 align-middle " />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
        <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;



const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-gray-500 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
