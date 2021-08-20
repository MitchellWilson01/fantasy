import { createSlice } from '@reduxjs/toolkit'

export const draftSlice = createSlice({
  name: 'draft',
  initialState: {
    id: null,
    status: null,
    settings: null,
    draftOrder: null,
    draftType: null,
    scoringType: null,
    totalRosters: null,
    picks: null,
    nextPick: null
  },
  reducers: {
    setDraftId: (state, action) => {
      state.id = action.payload
    },
    setDraftStatus: (state, action) => {
      state.status = action.payload
    },
    setDraftSettings: (state, action) => {
      state.settings = action.payload
    },
    setDraftOrder: (state, action) => {
      state.draftOrder = action.payload
    },
    setDraftType: (state, action) => {
      state.draftType = action.payload
    },
    setScoringType: (state, action) => {
      state.scoringType = action.payload
    },
    setTotalRosters: (state, action) => {
      state.totalRosters = action.payload
    },
    updateDraftPicks: (state, action) => {
      state.picks = action.payload
    },
    setNextPick: (state, action) => {
      state.nextPick = action.payload
    }
  }
})

export const { 
  setDraftId,
  setDraftStatus, 
  setDraftSettings, 
  setDraftOrder, 
  setDraftType, 
  setScoringType, 
  setTotalRosters,
  updateDraftPicks,
  setNextPick 
} = draftSlice.actions

export default draftSlice.reducer