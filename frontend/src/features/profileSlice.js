import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  error: null,
  success: false,
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    profileStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    profileSuccess: (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    profileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    resetProfileStatus: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
})

export const { profileStart, profileSuccess, profileFailure, resetProfileStatus } = profileSlice.actions
export default profileSlice.reducer
