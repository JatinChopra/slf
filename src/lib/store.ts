import { configureStore } from "@reduxjs/toolkit";

// import reducers
import audioControllerReducer from "@/store/AudioControllerSlice";
import sideBarReducer from "@/store/SideBarSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      audioController: audioControllerReducer,
      sideBar: sideBarReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
