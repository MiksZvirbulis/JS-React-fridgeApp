import * as AT from '../actionTypes'
import updateObject from '../../utils/updateObject'

const initialState = {
  items: [],
  foundItems: [],
  item: [],
  loading: false,
  error: false,
  added: false,
  deleted: false,
  usersWithAccess: [],
  fridges: [],
  openFridgeId: null,
  types: ['apricot','asparagus','avocado','bacon','baguette','banana','beetroot','brazil-nut','bread','broccoli','burger','cabbage','cake','candy','carrot','celery','cheese','chili-pepper','chocolate','cinnamon-sticks','coconut','corn','crab','crisps','croissant','dairy','dessert','dragon-fruit','eggplant','eggs','finished-dish','finocchio','fish','flour','fries','grapes','hazelnut','hot-dog','ice-cream','jam','jamon','jelly','kebab','kiwi','kohlrabi','leek','lemon','lettuce','meat','melon','muffins','mushroom','naan','noodles','nuts','olive-oil','olives','onions','oranges','pancakes','papaya','pastry','peaches','pears','peas','peppers','pet-food','pie','pineapple','pizza','plum','pomegranate','porridge','potato','prawns','pretzel','pumpkin','quesadilla','radish','raspberry','rice','salami','sauce','snacks','spaghetti','spices','spinach','sprout','steak','strawberry','sweet-potato','sweetener','taco','tin-food','tomato','watermelon','wrap','zucchini']
}

function addItemSuccess(state, item, itemId) {
  const items = [ ...state.items ]
  const newItem = {}
  for (let key in item) {
    newItem[key] = item[key].value
  }
  newItem['id'] = itemId
  items.push(newItem)
  return updateObject(state, { loading: false, item, foundItems: items, added: true, openFridgeId: newItem.fridgeId })
}

function updateItemSuccess(state, itemId, item) {
  const items = [ ...state.items ]
  const itemIndex = items.findIndex(it => it.id === parseInt(itemId))
  const editedItem = { id: parseInt(itemId) }
  for (let key in item) {
    editedItem[key] = item[key].value
  }
  items[itemIndex] = editedItem
  return updateObject(state, { loading: false, item, items, added: true })
}

function deleteItemSuccess(state, itemId) {
  const foundItems = [ ...state.items ]
  const items = [ ...state.items ]
  const itemIndex = foundItems.findIndex(it => it.id === parseInt(itemId))
  foundItems.splice(itemIndex, 1)
  const itemsItemIndex = items.findIndex(it => it.id === parseInt(itemId))
  items.splice(itemsItemIndex, 1)
  return updateObject(state, { loading: false, foundItems, items, deleted: true })
}

function giveUserSuccess(state, username) {
  const usersWithAccess = [ ...state.usersWithAccess ]
  usersWithAccess.push( { username } )
  return updateObject(state, { loading: false, error: null, usersWithAccess })
}

function deleteUserSuccess(state, username) {
  const usersWithAccess = [ ...state.usersWithAccess ]
  const userIndex = usersWithAccess.findIndex(user => user.username === username)
  usersWithAccess.splice(userIndex, 1)
  return updateObject(state, { loading: false, error: null, usersWithAccess })
}

export default function fridge(state = initialState, action) {
  switch(action.type) {
    // Fetch Fridge Items
    case AT.FRIDGE_FETCH_ITEMS:
    return updateObject(state, { loading: true, added: false, error: null, foundItems: [], openFridgeId: null } )
    case AT.FRIDGE_FETCH_ITEMS_SUCCESS:
    return updateObject(state, { loading: false, items: action.items, foundItems: action.foundItems, openFridgeId: action.openFridgeId })
    case AT.FRIDGE_FETCH_ITEMS_ERROR:
    return updateObject(state, { loading: false, error: action.error, openFridgeId: null })
    // Add Fridge Item
    case AT.FRIDGE_ADD_ITEM:
    return updateObject(state, { loading: true, added: false, error: null } )
    case AT.FRIDGE_ADD_ITEM_SUCCESS:
    return addItemSuccess(state, action.item, action.itemId)
    case AT.FRIDGE_ADD_ITEM_ERROR:
    return updateObject(state, { loading: false, error: action.error, added: false })
    // Fetch Fridge Item
    case AT.FRIDGE_FETCH_ITEM:
    return updateObject(state, { loading: true, item: [], error: null, added: false } )
    case AT.FRIDGE_FETCH_ITEM_SUCCESS:
    return updateObject(state, { loading: false, item: action.item })
    case AT.FRIDGE_FETCH_ITEM_ERROR:
    return updateObject(state, { loading: false, error: action.error })
    // Update Fridge Item
    case AT.FRIDGE_UPDATE_ITEM:
    return updateObject(state, { loading: true, item: [], added: false, error: null } )
    case AT.FRIDGE_UPDATE_ITEM_SUCCESS:
    return updateItemSuccess(state, action.itemId, action.item)
    case AT.FRIDGE_UPDATE_ITEM_ERROR:
    return updateObject(state, { loading: false, error: action.error, added: false })
    // Delete Fridge Item
    case AT.FRIDGE_DELETE_ITEM:
    return updateObject(state, { loading: true, item: [], deleted: false, error: null } )
    case AT.FRIDGE_DELETE_ITEM_SUCCESS:
    return deleteItemSuccess(state, action.username)
    case AT.FRIDGE_DELETE_ITEM_ERROR:
    return updateObject(state, { loading: false, error: action.error, deleted: false })
    // Get User Access
    case AT.USER_ACCESS:
    return updateObject(state, { loading: true, error: null, usersWithAccess: [] } )
    case AT.USER_ACCESS_SUCCESS:
    return updateObject(state, { loading: false, error: null, usersWithAccess: action.users } )
    case AT.USER_ACCESS_ERROR:
    return updateObject(state, { loading: false, error: action.error, usersWithAccess: [] })
    // Give User Access
    case AT.GIVE_USER_ACCESS:
    return updateObject(state, { loading: true, error: null } )
    case AT.GIVE_USER_ACCESS_SUCCESS:
    return giveUserSuccess(state, action.username)
    case AT.GIVE_USER_ACCESS_ERROR:
    return updateObject(state, { loading: false, error: action.error })
    // Delete User Access
    case AT.DELETE_USER_ACCESS:
    return updateObject(state, { loading: true, error: null } )
    case AT.DELETE_USER_ACCESS_SUCCESS:
    return deleteUserSuccess(state, action.userId)
    case AT.DELETE_USER_ACCESS_ERROR:
    return updateObject(state, { loading: false, error: action.error })
    // Get Fridges With Access
    case AT.FRIDGES_WITH_ACCESS:
    return updateObject(state, { loading: true, error: null, deleted: false, added: false } )
    case AT.FRIDGES_WITH_ACCESS_SUCCESS:
    return updateObject(state, { loading: false, error: null, fridges: action.fridges } )
    case AT.FRIDGES_WITH_ACCESS_ERROR:
    return updateObject(state, { loading: false, error: action.error })
    // Reset after Logout
    case AT.RESET_LOGOUT:
    return updateObject(state, { items: [], item: [], foundItems: [], added: false, deleted: false, usersWithAccess: [], fridges: [], openFridgeId: null })
    default:
    return state;
  }
}
