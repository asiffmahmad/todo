import { createSlice } from '@reduxjs/toolkit'

const darkModeValue = localStorage.getItem('darkMode')
const darkMode = darkModeValue === null ? true : darkModeValue === 'true'

const initialState = {
  darkMode,
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode.toString());
    },
  },
})

export const { toggleTheme } = themeSlice.actions
export default themeSlice.reducer
