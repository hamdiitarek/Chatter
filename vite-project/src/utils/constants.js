
export const HOST = import.meta.env.VITE_SERVER_URL;
export const Auth_Routes = "api/auth";
export const Signup_Route = `${Auth_Routes}/signup`;
export const Login_Route = `${Auth_Routes}/login`;
export const GET_USER_INFO = `${Auth_Routes}/userinfo`; // Ensure this matches the server route
export const UPDATE_PROFILE_ROUTE = `${Auth_Routes}/update-profile`;
export const Update_Profile_Image_Route = `${Auth_Routes}/update-profile-image`;
export const Delete_Profile_Image_Route = `${Auth_Routes}/delete-profile-image`;


