import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define the types for a comment and the slice state
export interface Comment {
  id?: string;
  userId: string;
  username: string;
  img: string;
  songId: string;
  text: string;
  timestamp: number; // Time in the audio where the comment was made
  // You can add more properties as needed
}

interface CommentsState {
  comments: Comment[]; // Array of comments
  loading: boolean; // Indicates whether an operation is in progress
  error: string | null; // Stores any error that occurs during an operation
}

// Initial state with types
const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
};

// Async thunk to handle the comment submission to the backend
export const submitComment = createAsyncThunk<
  Comment,
  Comment,
  { rejectValue: string }
>("comments/submitComment", async (comment, { rejectWithValue }) => {
  try {
    const response = await axios.post<Comment>(
      `${process.env.NEXT_PUBLIC_API}/comment/add`,
      comment
    );
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Something went wrong");
  }
});

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addComment(state, action: PayloadAction<Comment>) {
      console.log("Add comment called");
      state.comments.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        submitComment.fulfilled,
        (state, action: PayloadAction<Comment>) => {
          state.loading = false;
          state.comments.push(action.payload);
        }
      )
      .addCase(
        submitComment.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Failed to submit comment";
        }
      );
  },
});

export const commentSliceActions = commentsSlice.actions;

export default commentsSlice.reducer;
