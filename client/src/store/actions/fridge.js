import * as AT from '../actionTypes'
import axios from 'axios'

// Receiving all Fridge Items

const fetchFridgeItems = () => {
  return {
    type: AT.FRIDGE_FETCH_ITEMS
  }
}

const fetchFridgeItemsSuccess = items => {
  return {
    type: AT.FRIDGE_FETCH_ITEMS_SUCCESS,
    items
  }
}

const fetchFridgeItemsError = error => {
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

// Adding a new Fridge Item

const addFridgeItems = () => {
  return {
    type: AT.FRIDGE_ADD_ITEM
  }
}

const addFridgeItemsSuccess = (item, response) => {
  return {
    type: AT.FRIDGE_ADD_ITEM_SUCCESS,
    item: item,
    response: response
  }
}

const addFridgeItemsError = error => {
  return {
    type: AT.FRIDGE_ADD_ITEM_ERROR,
    error: error
  }
}

export const addFridgeItemsAsync = item => {
  return async dispatch => {
    dispatch(addFridgeItems());
    try {
      const response = await axios.post('http://localhost:5000/api/fridge', item)
      dispatch(addFridgeItemsSuccess(item, response.data))
      dispatch(fetchFridgeItemsAsync())
    } catch (error) {
      dispatch(addFridgeItemsError(error))
    }
  }
}

// Fetching an existing Fridge Item

const fetchFridgeItem = () => {
  return {
    type: AT.FRIDGE_FETCH_ITEM
  }
}

const fetchFridgeItemSuccess = item => {
  return {
    type: AT.FRIDGE_FETCH_ITEM_SUCCESS,
    item: item
  }
}

const fetchFridgeItemError = error => {
  return {
    type: AT.FRIDGE_FETCH_ITEM_ERROR,
    error: error
  }
}

export const fetchFridgeItemAsync = itemId => {
  return async dispatch => {
    dispatch(fetchFridgeItem());
    try {
      const response = await axios.get('http://localhost:5000/api/fridge/' + itemId)
      if (response.data === 'NOT_FOUND') {
        dispatch(fetchFridgeItemError('Item with requested ID was not found!'))
      } else {
        dispatch(fetchFridgeItemSuccess(response.data))
      }
    } catch (error) {
      dispatch(fetchFridgeItemError(error))
    }
  }
}

// Updating an existing Fridge Item

const updateFridgeItem = () => {
  return {
    type: AT.FRIDGE_UPDATE_ITEM
  }
}

const updateFridgeItemSuccess = item => {
  return {
    type: AT.FRIDGE_UPDATE_ITEM_SUCCESS,
    item: item
  }
}

const updateFridgeItemError = error => {
  return {
    type: AT.FRIDGE_UPDATE_ITEM_ERROR,
    error: error
  }
}

export const updateFridgeItemAsync = (itemId, newData) => {
  return async dispatch => {
    dispatch(updateFridgeItem());
    try {
      const response = await axios.put('http://localhost:5000/api/fridge/' + itemId, newData)
      if (response.data === 'NOT_FOUND') {
        dispatch(updateFridgeItemError('Item with requested ID was not found! - ' + itemId))
      } else {
        dispatch(updateFridgeItemSuccess(newData))
      }
    } catch (error) {
      dispatch(updateFridgeItemError(error))
    }
  }
}
