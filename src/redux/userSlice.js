import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: null,
    draftPosition: null,
    roster: null,
    queue: []
  },
  reducers: {
    setUserId: (state, action) => {
      state.id = action.payload
    },
    setDraftPosition: (state, action) => {
      state.draftPosition = action.payload
    },
    updateRoster: (state, action) => {
      state.roster = action.payload
    },
    updateQueue: (state, action) => {
      state.queue = action.payload
    }
  }
})

export const { setUserId, setDraftPosition, updateRoster, updateQueue } = userSlice.actions

export default userSlice.reducer