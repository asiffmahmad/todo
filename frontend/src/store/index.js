import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import tasksReducer from '../features/tasksSlice'
import dashboardReducer from '../features/dashboardSlice'
import profileReducer from '../features/profileSlice'
import themeReducer from '../features/themeSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    dashboard: dashboardReducer,
    profile: profileReducer,
    theme: themeReducer,
  },
})

export default store
