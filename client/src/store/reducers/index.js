import { combineReducers } from 'redux'
import fridge from './fridge'
import auth from './auth'

const rootReducer = combineReducers({
  fridge,
  auth
});

export default rootReducer;
