// src/slices/audioControllerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { metaDataSchema } from "./SongDataSlice";
interface AudioControllerState {
  songName: string;
  artistName: string;
  songIndex: number;
  isPlaying: boolean;
  duration: number;
  current: number;
  image: string;
  src: string | undefined;
  data: metaDataSchema[];
}

const initialState: AudioControllerState = {
  songName: "",
  artistName: "",
  songIndex: 0,
  isPlaying: false,
  duration: 0,
  current: 0,
  image: "",
  src: undefined,
  data: [],
};

const audioControllerSlice = createSlice({
  name: "audioController",
  initialState,
  reducers: {
    setSongIndex(state, action: PayloadAction<number>) {
      console.log("form the state");
      state.songIndex = action.payload;
    },
    setIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
    setDuration(state, action: PayloadAction<number>) {
      state.duration = action.payload;
    },
    setCurrent(state, action: PayloadAction<number>) {
      state.current = action.payload;
    },
    setSrc(state, action: PayloadAction<string>) {
      state.src = action.payload;
    }, // Optionally, you can add a reset or other action here
    setData(state, action: PayloadAction<metaDataSchema[]>) {
      state.data = action.payload;
    },
    setImage(state, action: PayloadAction<string>) {
      state.image = action.payload;
    },
    setSongName(state, action: PayloadAction<string>) {
      state.songName = action.payload;
    },
    setArtistName(state, action: PayloadAction<string>) {
      state.artistName = action.payload;
    },
    resetState(state) {
      return initialState;
    },
  },
});

export const audioControllerSliceActions = audioControllerSlice.actions;

export default audioControllerSlice.reducer;
