import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
// import { useDispatch } from 'react-redux'
import rootReducer, { RootState } from './rootReducer'

export const store = configureStore({
    reducer: rootReducer,
    devTools:true
})

// export type AppDispatch = typeof store.dispatch
// export const useAppDispatch = () => useDispatch<AppDispatch>() // Export a hook that can be reused to resolve types
export type AppDispatch = typeof store.dispatch

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>