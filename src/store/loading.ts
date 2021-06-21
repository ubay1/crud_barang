/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface LoadingState {
    show: boolean
    timeout?: number
}

const initialState: LoadingState = {
    show: false,
    timeout: 0,
}

// Slice
const loadingSlice = createSlice({
  name: 'loading',
  initialState ,
  reducers: {
    setLoading(state, action: PayloadAction<LoadingState>) {
        state.show = action.payload.show
        state.timeout = action.payload.timeout
    },
    setLoadingShow(state, action: PayloadAction<boolean>) {
      state.show = action.payload
      if(action.payload===false){
          state.timeout=0
      }
    },
  },
});

// Actions
export const { setLoading, setLoadingShow } = loadingSlice.actions
export default loadingSlice.reducer