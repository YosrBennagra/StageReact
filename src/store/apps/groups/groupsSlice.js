import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchGroups = createAsyncThunk('groups/fetchGroups', async () => {
  const response = await axios.get('http://localhost:3001/groups');
  return response.data;
});

export const fetchGroupMembers = createAsyncThunk('groups/fetchGroupMembers', async (groupId) => {
  const response = await axios.get(`http://localhost:3001/groups/${groupId}`);
  return response.data;
});

export const fetchGroupLessons = createAsyncThunk('groups/fetchGroupLessons', async (groupId) => {
  const response = await axios.get(`http://localhost:3001/lessons/bygroup/${groupId}`);
  return response.data; // Assuming response.data is an array of lessons
});

export const createLesson = createAsyncThunk('groups/createLesson', async (lessonData) => {
  try {
    const response = await axios.post('http://localhost:3001/lessons', lessonData);
    return response.data; // Assuming response.data is the created lesson object
  } catch (error) {
    console.error('Error creating lesson:', error);
    throw error;
  }
});

const groupsSlice = createSlice({
  name: 'groups',
  initialState: {
    groups: [],
    selectedGroup: null,
    members: [],
    lessons: [], // Initialize lessons as an empty array
    status: 'idle',
    error: null,
  },
  reducers: {
    selectGroup(state, action) {
      state.selectedGroup = action.payload;
      state.members = [];
      state.lessons = []; // Clear lessons when a new group is selected
    },
    addLesson(state, action) {
      state.lessons.push(action.payload); // Add the new lesson to the lessons array
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchGroupMembers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGroupMembers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.members = action.payload.users;
      })
      .addCase(fetchGroupMembers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchGroupLessons.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGroupLessons.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lessons = action.payload; // Update lessons with the fetched data
      })
      .addCase(fetchGroupLessons.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lessons.push(action.payload); // Add the created lesson to the lessons array
      })
      .addCase(createLesson.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { selectGroup, addLesson } = groupsSlice.actions;

export default groupsSlice.reducer;
