import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  stats: {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completionPercentage: 0,
    recentTasks: [],
  },
  loading: false,
  error: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    dashboardStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    dashboardSuccess: (state, action) => {
      state.loading = false;
      state.stats = action.payload;
    },
    dashboardFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
})

export const { dashboardStart, dashboardSuccess, dashboardFailure } = dashboardSlice.actions
export default dashboardSlice.reducer
