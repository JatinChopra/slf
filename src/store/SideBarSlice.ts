import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state of the sidebar
interface SidebarState {
  isOpen: boolean;
}

const initialState: SidebarState = {
  isOpen: false,
};

// Create a slice of the Redux store
const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    // Action to toggle the sidebar
    toggleSidebar(state) {
      state.isOpen = !state.isOpen;
    },
    // Action to set the sidebar to open
    openSidebar(state) {
      state.isOpen = true;
    },
    // Action to set the sidebar to closed
    closeSidebar(state) {
      state.isOpen = false;
    },
  },
});

// Export actions to be used in components
export const sideBarActions = sidebarSlice.actions;

// Export the reducer to be used in the store
export default sidebarSlice.reducer;
