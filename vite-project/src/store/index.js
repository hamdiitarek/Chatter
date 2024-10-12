import { create } from "zustand";

// CreateAuthSlice function definition
export const CreateAuthSlice = (set) => ({
  userInfo: undefined, // Initial state
  setUserInfo: (userInfo) => set({ userInfo }), // Function to update userInfo
});

// Create the Zustand store using the slice
const UseAppStore = create((set) => ({
  ...CreateAuthSlice(set), // Spread the auth slice into the store
}));

export { UseAppStore };
