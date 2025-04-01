import { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import apiclient from "@/lib/api_client";
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTES } from "@/utils/constants";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/use-media-query";

const CreateChannel = () => {
  const [newChannelModal, setNewChannelModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]); // Initialize as empty array
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Fetch contacts with proper error handling
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await apiclient.get(GET_ALL_CONTACTS_ROUTES, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Ensure response.data.contacts exists and is an array
        const contacts = Array.isArray(response.data?.contacts) 
          ? response.data.contacts 
          : [];
          
        setAllContacts(contacts);
      } catch (err) {
        setError(err);
        toast.error("Failed to load contacts");
      } finally {
        setIsLoading(false);
      }
    };

    if (newChannelModal) {
      fetchContacts();
    }
  }, [newChannelModal]);

  const createChannel = async () => {
    if (!channelName.trim()) {
      toast.error("Channel name cannot be empty");
      return;
    }
    
    if (selectedContacts.length === 0) {
      toast.error("Please select at least one member");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await apiclient.post(
        CREATE_CHANNEL_ROUTE,
        {
          name: channelName,
          members: selectedContacts.map((contact) => contact.value),
        },
        { 
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if(response.status === 201) {
        toast.success("Channel created successfully");
        setChannelName("");
        setSelectedContacts([]);
        setNewChannelModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create channel");
    } finally {
      setIsLoading(false);
    }
  };

  // Safe rendering with fallback for empty state
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              onClick={() => setNewChannelModal(true)}
            >
              <PlusIcon className="text-gray-600 dark:text-gray-400" />
            </button>
          </TooltipTrigger>
          <TooltipContent side={isMobile ? "top" : "right"}>
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Channel</DialogTitle>
            <DialogDescription>
              Add a name and members for your new channel
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Input
              placeholder="Channel Name"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              disabled={isLoading}
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Add Members</label>
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Spinner className="h-5 w-5" />
                </div>
              ) : error ? (
                <div className="text-red-500 text-sm">
                  Failed to load contacts. Try again.
                </div>
              ) : (
                <div className="border rounded-lg p-2 max-h-60 overflow-y-auto">
                  {allContacts.length > 0 ? (
                    allContacts.map((contact) => (
                      <div 
                        key={contact._id}
                        className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      >
                        <input
                          type="checkbox"
                          id={`contact-${contact._id}`}
                          checked={selectedContacts.some(c => c.value === contact._id)}
                          onChange={() => {
                            setSelectedContacts(prev => 
                              prev.some(c => c.value === contact._id)
                                ? prev.filter(c => c.value !== contact._id)
                                : [...prev, { 
                                    label: contact.firstName 
                                      ? `${contact.firstName} ${contact.lastName || ''}` 
                                      : contact.email,
                                    value: contact._id 
                                  }]
                            );
                          }}
                          className="mr-2"
                        />
                        <label htmlFor={`contact-${contact._id}`} className="flex-1">
                          {contact.firstName 
                            ? `${contact.firstName} ${contact.lastName || ''}` 
                            : contact.email}
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No contacts available
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={createChannel}
            disabled={isLoading || !channelName.trim() || selectedContacts.length === 0}
            className="w-full"
          >
            {isLoading ? "Creating..." : "Create Channel"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Simple spinner component
const Spinner = ({ className }) => (
  <svg
    className={`animate-spin h-5 w-5 text-current ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default CreateChannel;