import * as AT from '../actionTypes'
import axios from 'axios'

export const fetchFridgeItems = () => {
  return {
    type: AT.FRIDGE_FETCH_ITEMS
  }
}

export const fetchFridgeItemsSuccess = (items) => {
  return {
    type: AT.FRIDGE_FETCH_ITEMS_SUCCESS,
    items
  }
}

export const fetchFridgeItemsError = (error) => {
  return {
    type: AT.FRIDGE_FETCH_ITEMS_ERROR,
    error
  }
}

export const fetchFridgeItemsAsync = () => {
  return async dispatch => {
    dispatch(fetchFridgeItems());
    try {
      const response = await axios('http://localhost:5000/api/fridge')
      dispatch(fetchFridgeItemsSuccess(response.data))
    } catch (error) {
      dispatch(fetchFridgeItemsError(error))
    }
  }
}

export const addFridgeItems = () => {
  return {
    type: AT.FRIDGE_ADD_ITEM
  }
}

export const addFridgeItemsSuccess = (item, response) => {
  return {
    type: AT.FRIDGE_ADD_ITEM_SUCCESS,
    item: item,
    response: response
  }
}

export const addFridgeItemsError = (error) => {
  return {
    type: AT.FRIDGE_ADD_ITEM_ERROR,
    error: error
  }
}

export const addFridgeItemsAsync = (item) => {
  return async dispatch => {
    dispatch(addFridgeItems());
    try {
      const response = await axios.post('http://localhost:5000/api/fridge', item)
      dispatch(addFridgeItemsSuccess(item, response.data))
    } catch (error) {
      dispatch(addFridgeItemsError(error))
    }
  }
}
