import * as AT from '../actionTypes'
import axios from 'axios'
import compareAndSort from '../../utils/compareAndSort'

const API_URL = '/api/fridge'

// Receiving all Fridge Items

const fetchFridgeItems = () => { return { type: AT.FRIDGE_FETCH_ITEMS } }

const fetchFridgeItemsSuccess = (items, oldFoundItems, action, actionValue, fridgeId) => {
  let loadedItems = [ ...items ]
  let foundItems = []
  if (oldFoundItems.length === 0) {
    foundItems = loadedItems
    oldFoundItems = loadedItems
  }

  if (action === 'search') {
    if (actionValue === "") {
      foundItems = loadedItems
    } else {
      foundItems = loadedItems.filter(el => {
        return el.name.toLowerCase().indexOf(actionValue.toLowerCase()) > -1
      })
    }
  }
  if (action === 'sort') {
    switch (actionValue) {
      case 'by_name_asc':
        foundItems = compareAndSort(oldFoundItems, 'name', 'asc')
        break;
      case 'by_name_desc':
        foundItems = compareAndSort(oldFoundItems, 'name', 'desc')
        break;
      case 'by_exp_asc':
        foundItems = compareAndSort(oldFoundItems, 'expiryDate', 'asc')
        break;
      case 'by_exp_desc':
        foundItems = compareAndSort(oldFoundItems, 'expiryDate', 'desc')
        break;
      case 'by_date_asc':
        foundItems = compareAndSort(oldFoundItems, 'id', 'asc')
        break;
      case 'by_date_desc':
        foundItems = compareAndSort(oldFoundItems, 'id', 'desc')
        break;
      default:
        foundItems = loadedItems
    }
  }
  return { type: AT.FRIDGE_FETCH_ITEMS_SUCCESS, foundItems, items, openFridgeId: fridgeId }
}

const fetchFridgeItemsError = error => { return { type: AT.FRIDGE_FETCH_ITEMS_ERROR, error } }

export const fetchFridgeItemsAsync = (loadedItems, foundItems, action = false, actionValue, fridgeId) => {
  return async dispatch => {
    dispatch(fetchFridgeItems())
    if (loadedItems.length === 0 && fridgeId !== undefined) {
      try {
        const response = await axios.get(API_URL + '/items/' + fridgeId)
        if (response.status === 202) {
          dispatch(fetchFridgeItemsError(response.data))
        } else {
          dispatch(fetchFridgeItemsSuccess(response.data, foundItems, action, actionValue, fridgeId))
        }
      } catch (error) {
        dispatch(fetchFridgeItemsError(error.message))
      }
    } else {
      dispatch(fetchFridgeItemsSuccess(loadedItems, foundItems, action, actionValue))
    }
  }
}

// Adding a new Fridge Item

const addFridgeItems = () => { return { type: AT.FRIDGE_ADD_ITEM } }

const addFridgeItemsSuccess = (item, itemId) => { return { type: AT.FRIDGE_ADD_ITEM_SUCCESS, item, itemId } }

const addFridgeItemsError = error => { return { type: AT.FRIDGE_ADD_ITEM_ERROR, error } }

export const addFridgeItemsAsync = item => {
  return async dispatch => {
    dispatch(addFridgeItems());
    dispatch(fetchFridgeItemsAsync([], [], false, false));
    try {
      const response = await axios.post(API_URL + '/item', item)
      if (typeof response.data === 'object' && response.data !== null) {
        dispatch(addFridgeItemsSuccess(item, response.data.itemId))
      } else {
        dispatch(addFridgeItemsError(response.data))
      }
    } catch (error) {
      dispatch(addFridgeItemsError(error.message))
    }
  }
}

// Fetching an existing Fridge Item

const fetchFridgeItem = () => { return { type: AT.FRIDGE_FETCH_ITEM } }

const fetchFridgeItemSuccess = item => { return { type: AT.FRIDGE_FETCH_ITEM_SUCCESS, item } }

const fetchFridgeItemError = error => { return { type: AT.FRIDGE_FETCH_ITEM_ERROR, error } }

export const fetchFridgeItemAsync = itemId => {
  return async dispatch => {
    dispatch(fetchFridgeItem());
    try {
      const response = await axios.get(API_URL + '/item/' + itemId)
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

const updateFridgeItem = () => { return { type: AT.FRIDGE_UPDATE_ITEM } }

const updateFridgeItemSuccess = (itemId, item) => { return { type: AT.FRIDGE_UPDATE_ITEM_SUCCESS, itemId, item } }

const updateFridgeItemError = error => { return { type: AT.FRIDGE_UPDATE_ITEM_ERROR, error } }

export const updateFridgeItemAsync = (itemId, newData) => {
  return async dispatch => {
    dispatch(updateFridgeItem());
    try {
      const response = await axios.put(API_URL + '/item/' + itemId, newData)
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

const deleteFridgeItem = () => { return { type: AT.FRIDGE_DELETE_ITEM } }

const deleteFridgeItemSuccess = itemId => { return { type: AT.FRIDGE_DELETE_ITEM_SUCCESS, itemId } }

const deleteFridgeItemError = error => { return { type: AT.FRIDGE_DELETE_ITEM_ERROR, error } }

export const deleteFridgeItemAsync = itemId => {
  return async dispatch => {
    dispatch(deleteFridgeItem());
    try {
      const response = await axios.delete(API_URL + '/item/' + itemId)
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

// Getting users with access

const getUserAccess = () => { return { type: AT.USER_ACCESS } }

const getUserAccessSuccess = users => { return { type: AT.USER_ACCESS_SUCCESS, users } }

const getUserAccessError = error => { return { type: AT.USER_ACCESS_ERROR, error } }

export const getUserAccessAsync = fridgeId => {
  return async dispatch => {
    dispatch(getUserAccess());
    try {
      const response = await axios.get(API_URL + '/access/' + fridgeId)
      if (response.status === 200) {
        dispatch(getUserAccessSuccess(response.data))
      } else {
        dispatch(getUserAccessError(response.data))
      }
    } catch (error) {
      dispatch(getUserAccessError(error.message))
    }
  }
}

// Give user access

const giveUserAccess = () => { return { type: AT.GIVE_USER_ACCESS } }

const giveUserAccessSuccess = username => { return { type: AT.GIVE_USER_ACCESS_SUCCESS, username } }

const giveUserAccessError = error => { return { type: AT.GIVE_USER_ACCESS_ERROR, error } }

export const giveUserAccessAsync = user => {
  return async dispatch => {
    dispatch(giveUserAccess());
    try {
      const response = await axios.post(API_URL + '/access/', { userId: user.userId, username: user.username, fridgeId: user.fridgeId })
      if (response.status === 200) {
        dispatch(giveUserAccessSuccess(user.username))
      } else {
        dispatch(giveUserAccessError(response.data))
      }
    } catch (error) {
      dispatch(giveUserAccessError(error.message))
    }
  }
}

// Give user access

const deleteUserAccess = () => { return { type: AT.DELETE_USER_ACCESS } }

const deleteUserAccessSuccess = username => { return { type: AT.DELETE_USER_ACCESS_SUCCESS, username } }

const deleteUserAccessError = error => { return { type: AT.DELETE_USER_ACCESS_ERROR, error } }

export const deleteUserAccessAsync = user => {
  return async dispatch => {
    dispatch(deleteUserAccess());
    try {
      const response = await axios.post(API_URL + '/deleteAccess/', { userId: user.userId, username: user.username, fridgeId: user.fridgeId })
      if (response.status === 200) {
        dispatch(deleteUserAccessSuccess(user.username))
      } else {
        dispatch(deleteUserAccessError(response.data))
      }
    } catch (error) {
      dispatch(deleteUserAccessError(error.message))
    }
  }
}

// Getting fridges which user has access to

const getFridges = () => { return { type: AT.FRIDGES_WITH_ACCESS } }

const getFridgesSuccess = fridges => { return { type: AT.FRIDGES_WITH_ACCESS_SUCCESS, fridges } }

const getFridgesError = error => { return { type: AT.FRIDGES_WITH_ACCESS_ERROR, error } }

export const getFridgesAsync = userId => {
  return async dispatch => {
    dispatch(getFridges());
    try {
      const response = await axios.get(API_URL + '/all/' + userId)
      if (response.status === 200) {
        dispatch(getFridgesSuccess(response.data))
      } else {
        dispatch(getFridgesError(response.data))
      }
    } catch (error) {
      dispatch(getFridgesError(error.message))
    }
  }
}

// Reset data after logout

export const resetLogout = () => { return { type: AT.RESET_LOGOUT } }