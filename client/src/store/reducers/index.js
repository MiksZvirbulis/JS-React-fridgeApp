import { combineReducers } from 'redux'
import fridge from './fridge'

const rootReducer = combineReducers({
  fridge: fridge
});

export default rootReducer;
