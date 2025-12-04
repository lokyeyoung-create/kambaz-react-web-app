import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [] as any[],
  folders: [] as any[],
  selectedPost: null as any,
  selectedFolder: null as string | null,
  showSidebar: true,
  stats: {
    totalPosts: 0,
    unansweredQuestions: 0,
    instructorResponses: 0,
    studentResponses: 0,
  },
};

const piazzaSlice = createSlice({
  name: "piazza",
  initialState,
  reducers: {
    setPosts: (state, { payload }) => {
      state.posts = payload;
    },
    addPost: (state, { payload }) => {
      state.posts = [payload, ...state.posts];
    },
    updatePost: (state, { payload }) => {
      state.posts = state.posts.map((p) => (p._id === payload._id ? payload : p));
      if (state.selectedPost?._id === payload._id) {
        state.selectedPost = payload;
      }
    },
    deletePost: (state, { payload }) => {
      state.posts = state.posts.filter((p) => p._id !== payload);
      if (state.selectedPost?._id === payload) {
        state.selectedPost = null;
      }
    },
    setSelectedPost: (state, { payload }) => {
      state.selectedPost = payload;
    },
    setFolders: (state, { payload }) => {
      state.folders = payload;
    },
    addFolder: (state, { payload }) => {
      state.folders = [...state.folders, payload];
    },
    updateFolder: (state, { payload }) => {
      state.folders = state.folders.map((f) => (f._id === payload._id ? payload : f));
    },
    removeFolder: (state, { payload }) => {
      state.folders = state.folders.filter((f) => f._id !== payload);
    },
    removeFolders: (state, { payload }) => {
      state.folders = state.folders.filter((f) => !payload.includes(f._id));
    },
    setSelectedFolder: (state, { payload }) => {
      state.selectedFolder = payload;
    },
    toggleSidebar: (state) => {
      state.showSidebar = !state.showSidebar;
    },
    setStats: (state, { payload }) => {
      state.stats = payload;
    },
  },
});

export const {
  setPosts,
  addPost,
  updatePost,
  deletePost,
  setSelectedPost,
  setFolders,
  addFolder,
  updateFolder,
  removeFolder,
  removeFolders,
  setSelectedFolder,
  toggleSidebar,
  setStats,
} = piazzaSlice.actions;

export default piazzaSlice.reducer;