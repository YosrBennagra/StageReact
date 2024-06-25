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

const groupsSlice = createSlice({
  name: 'groups',
  initialState: {
    groups: [],
    selectedGroup: null,
    members: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    selectGroup(state, action) {
      state.selectedGroup = action.payload;
      state.members = [];
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
      });
  },
});

export const { selectGroup } = groupsSlice.actions;

export default groupsSlice.reducer;
