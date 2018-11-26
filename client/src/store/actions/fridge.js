import * as AT from '../actionTypes'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/fridge/'

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

export const fetchFridgeItemsAsync = loadedItems => {
  return async dispatch => {
    dispatch(fetchFridgeItems());
    if (loadedItems.length <= 0) {
      try {
        const response = await axios(API_URL)
        if (response.data === 'READING_ERROR') {
          dispatch(fetchFridgeItemsError(response.data))
        } else {
          dispatch(fetchFridgeItemsSuccess(response.data))
        }
      } catch (error) {
        dispatch(fetchFridgeItemsError(error.message))
      }
    } else {
      dispatch(fetchFridgeItemsSuccess(loadedItems))
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
    item,
    response
  }
}

const addFridgeItemsError = error => {
  return {
    type: AT.FRIDGE_ADD_ITEM_ERROR,
    error
  }
}

export const addFridgeItemsAsync = item => {
  return async dispatch => {
    dispatch(addFridgeItems());
    try {
      const response = await axios.post(API_URL, item)
      if (response.data === 'SUCCESS') {
        dispatch(addFridgeItemsSuccess(item, response.data))
      } else {
        dispatch(addFridgeItemsError(response.data))
      }
    } catch (error) {
      dispatch(addFridgeItemsError(error.message))
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
    item
  }
}

const fetchFridgeItemError = error => {
  return {
    type: AT.FRIDGE_FETCH_ITEM_ERROR,
    error
  }
}

export const fetchFridgeItemAsync = itemId => {
  return async dispatch => {
    dispatch(fetchFridgeItem());
    try {
      const response = await axios.get(API_URL + itemId)
      if (typeof response.data === 'object') {
        dispatch(fetchFridgeItemSuccess(response.data))
      } else {
        dispatch(fetchFridgeItemError(response.data))
      }
    } catch (error) {
      dispatch(fetchFridgeItemError(error.message))
    }
  }
}

// Updating an existing Fridge Item

const updateFridgeItem = () => {
  return {
    type: AT.FRIDGE_UPDATE_ITEM
  }
}

const updateFridgeItemSuccess = (itemId, item) => {
  return {
    type: AT.FRIDGE_UPDATE_ITEM_SUCCESS,
    itemId,
    item
  }
}

const updateFridgeItemError = error => {
  return {
    type: AT.FRIDGE_UPDATE_ITEM_ERROR,
    error
  }
}

export const updateFridgeItemAsync = (itemId, newData) => {
  return async dispatch => {
    dispatch(updateFridgeItem());
    try {
      const response = await axios.put(API_URL + itemId, newData)
      if (response.data === 'SUCCESS') {
        dispatch(updateFridgeItemSuccess(itemId, newData))
      } else {
        dispatch(updateFridgeItemError(response.data))
      }
    } catch (error) {
      dispatch(updateFridgeItemError(error.message))
    }
  }
}

// Deleting a Fridge Item

const deleteFridgeItem = () => {
  return {
    type: AT.FRIDGE_DELETE_ITEM
  }
}

const deleteFridgeItemSuccess = itemId => {
  return {
    type: AT.FRIDGE_DELETE_ITEM_SUCCESS,
    itemId
  }
}

const deleteFridgeItemError = error => {
  return {
    type: AT.FRIDGE_DELETE_ITEM_ERROR,
    error
  }
}

export const deleteFridgeItemAsync = itemId => {
  return async dispatch => {
    dispatch(deleteFridgeItem());
    try {
      const response = await axios.post(API_URL + 'delete/' + itemId)
      if (response.data === 'SUCCESS') {
        dispatch(deleteFridgeItemSuccess(itemId))
      } else {
        dispatch(deleteFridgeItemError(response.data))
      }
    } catch (error) {
      dispatch(deleteFridgeItemError(error.message))
    }
  }
}
