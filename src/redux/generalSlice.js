import { createSlice } from '@reduxjs/toolkit'

export const generalSlice = createSlice({
  name: 'general',
  initialState: {
    isMenuOpen: window.innerWidth >= 768,
    isBigScreen: window.innerWidth >= 768
  },
  reducers: {
    setMenuOpen: (state, action) => {
      state.isMenuOpen = action.payload
    },
    setBigScreen: (state, action) => {
      state.isBigScreen = action.payload
    }
  }
})

export const { setMenuOpen, setBigScreen } = generalSlice.actions

export default generalSlice.reducer