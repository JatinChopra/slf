import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type metaDataSchema = {
  _id: string;
  name: string;
  description: string;
  duration: number;
  image: string;
  attributes: [
    {
      trait_type: string;
      value: string;
    },
    {
      trait_type: string;
      value: string;
    }
  ];
};

// Define the initial state using the metaDataSchema interface
interface SongsState {
  data: metaDataSchema[];
}

const initialState: SongsState = {
  data: [],
};

// Create the slice
const songsSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    setSongs: (state, action: PayloadAction<metaDataSchema[]>) => {
      state.data = action.payload;
    },
    addSong: (state, action: PayloadAction<metaDataSchema>) => {
      state.data.push(action.payload);
    },
    clearSongs: (state) => {
      state.data = [];
    },
  },
});

export const songSliceAction = songsSlice.actions;
export default songsSlice.reducer;
