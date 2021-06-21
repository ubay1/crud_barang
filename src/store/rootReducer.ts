
import { combineReducers } from 'redux'
import loadingReducer from './loading'
import userReducer from './user'

const rootReducer = combineReducers({
  loading: loadingReducer,
  user: userReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;
