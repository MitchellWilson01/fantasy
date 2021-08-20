import { createSlice } from '@reduxjs/toolkit'

export const dataSlice = createSlice({
  name: 'data',
  initialState: {
    activeDataset: 0,
    dataset: null
  },
  reducers: {
    setActiveDataset: (state, action) => {
      state.activeDataset = action.payload
    },
    populateDataset: (state, action) => {
      state.dataset = action.payload
    },
    markPlayerAsDrafted: (state, action) => {
      state.dataset.forEach((player) => {
        const payloadName = action.payload.first_name.toLowerCase() + ' ' + action.payload.last_name.toLowerCase()
        if (player.name.toLowerCase() === payloadName || player.name.toLowerCase().includes(payloadName)) {
          const playerIndex = state.dataset.indexOf(player)
          state.dataset[playerIndex].isDrafted = true
        }
      })
    }
  }
})

export const { setActiveDataset, populateDataset, markPlayerAsDrafted } = dataSlice.actions

export default dataSlice.reducer