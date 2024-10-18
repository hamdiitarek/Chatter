
export const HOST = import.meta.env.VITE_SERVER_URL;
export const Auth_Routes = "api/auth";
export const Signup_Route = `${Auth_Routes}/signup`;
export const Login_Route = `${Auth_Routes}/login`;
export const GET_USER_INFO = `${Auth_Routes}/userinfo`; // Ensure this matches the server route
export const UPDATE_PROFILE_ROUTE = `${Auth_Routes}/update-profile`;
export const Update_Profile_Image_Route = `${Auth_Routes}/update-profile-image`;
export const Delete_Profile_Image_Route = `${Auth_Routes}/delete-profile-image`;
export const LOGOUT_ROUTE = `${Auth_Routes}/logout`;

export const CONTACTS_ROUTES = "api/contacts";
export const SEARCH_CONTACTS_ROUTES = `${CONTACTS_ROUTES}/search`;
export const GET_DM_CONTACTS_ROUTES = `${CONTACTS_ROUTES}/get-contacts-for-dm`;
export const GET_ALL_CONTACTS_ROUTES = `${CONTACTS_ROUTES}/get-all-contacts`;

export const MESSAGES_ROUTES = "api/messages";
export const GET_ALL_MESSAGES_ROUTES = `${MESSAGES_ROUTES}/get-messages`;
export const UPLOAD_FILE_ROUTE = `${MESSAGES_ROUTES}/upload-file`;

export const CHANNEL_ROUTES = "api/channel";
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTES}/create-channel`;
export const GET_USER_CHANNELS_ROUTE = `${CHANNEL_ROUTES}/get-user-channels`;
export const GET_CHANNEL_MESSAGES = `${CHANNEL_ROUTES}/get-channel-messages`;

