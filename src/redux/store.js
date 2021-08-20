import { configureStore } from '@reduxjs/toolkit'
import generalReducer from './generalSlice'
import userReducer from './userSlice'
import dataReducer from './dataSlice'
import draftReducer from './draftSlice'

export default configureStore({
  reducer: {
    general: generalReducer,
    user: userReducer,
    data: dataReducer,
    draft: draftReducer
  },
  devTools: true
})