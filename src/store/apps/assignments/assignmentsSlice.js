import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAssignments = createAsyncThunk('assignments/fetchAssignments', async () => {
  const response = await axios.get('http://localhost:3001/assignments');
  return response.data;
});

export const fetchAssignmentById = createAsyncThunk('assignments/fetchAssignmentById', async (id) => {
  const response = await axios.get(`http://localhost:3001/assignments/${id}`);
  return response.data;
});

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState: {
    assignments: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addAssignment: (state, action) => {
      state.assignments.push(action.payload);
    },
    removeAssignment: (state, action) => {
      state.assignments = state.assignments.filter(
        (assignment) => assignment.id !== action.payload.id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assignments = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchAssignmentById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAssignmentById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const fetchedAssignment = action.payload;
        const existingAssignment = state.assignments.find(a => a.id === fetchedAssignment.id);
        if (existingAssignment) {
          Object.assign(existingAssignment, fetchedAssignment);
        } else {
          state.assignments.push(fetchedAssignment);
        }
      })
      .addCase(fetchAssignmentById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
export const selectAssignments = (state) => state.assignments.assignments;

export const selectAssignmentById = createSelector(
  [selectAssignments, (state, assignmentId) => assignmentId],
  (assignments, assignmentId) => assignments.find(assignment => assignment.id === assignmentId)
);
export const { addAssignment, removeAssignment } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;
