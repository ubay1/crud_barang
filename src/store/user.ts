/* eslint-disable @typescript-eslint/no-unused-vars */
// import { HTTPGetUser } from '../pages/login/script';
// import { setLoadingAuth } from './loadingAuth';
// import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '.';
import Cookies from 'js-cookie';

export interface IUserProfile {
  nama?: any,
}

export interface UserState {
  token: string | any,
  nama: string
}

const initialState: UserState = {
  token: '',
  nama: ''
}

export const expiredToken = (dispatch: AppDispatch) => {
  Cookies.remove('token')
  // dispatch(setAuthStatus({
  //   token: ''
  // }))
  dispatch(setReduxUsername({
    nama: '',
  }))
}

// untuk ambil data user
export const initialStateUserAuthByAsync = async (dispatch: AppDispatch) => {
  return new Promise<UserState>(async (resolve, reject) => {
    
    let defaultValue: UserState = {
      token: '',
      nama: ''
    }

    try {
      const tokens = Cookies.get('token') === '' ? '' : Cookies.get('token');
      if (typeof Cookies.get('token') === 'undefined') {
        console.log('key token gaada')
        expiredToken(dispatch)
      } else {
        if (tokens === '') {
          console.log('kosong')
          expiredToken(dispatch)
        } else {
          const username = localStorage.getItem('username')
          dispatch(setAuthStatus({
            token: tokens,
          }))
          dispatch(setReduxUsername({
            nama: username
          }))
        }
      }
    } catch (e) {
      // error reading value
      console.log(e.message)
    }
    return defaultValue
  })
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setReduxUsername(state, action: PayloadAction<IUserProfile>) {
      state.nama = action.payload.nama
    },
    setAuthStatus(state, action: PayloadAction<{ token: any }>) {
      state.token = action.payload.token
      Cookies.set('token', action.payload.token)
    },
  },
})

export const {
  setReduxUsername,
  setAuthStatus,
} = userSlice.actions
export default userSlice.reducer