import api from './api'
import store from '../store'
import { profileStart, profileSuccess, profileFailure } from '../features/profileSlice'
import { loginSuccess } from '../features/authSlice'

export const updateProfile = async (profileData) => {
  store.dispatch(profileStart());
  try {
    const response = await api.put('/api/users/profile', profileData);
    const updatedUser = response.data;
    
    // Update auth slice cached user info
    const state = store.getState();
    const token = state.auth.token;
    const refreshToken = state.auth.refreshToken;
    
    store.dispatch(loginSuccess({ user: updatedUser, token, refreshToken }));
    store.dispatch(profileSuccess());
    return updatedUser;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update profile';
    store.dispatch(profileFailure(message));
    throw new Error(message);
  }
}
