import * as AT from '../actionTypes'
import updateObject from '../../utils/updateObject'

const initialState = {
  items: [],
  item: [],
  loading: false,
  error: false,
  added: false,
  deleted: false,
  types: ['apricot','asparagus','avocado','bacon','baguette','banana','beetroot','brazil-nut','bread','broccoli','burger','cabbage','cake','candy','carrot','celery','cheese','chili-pepper','chocolate','cinnamon-sticks','coconut','corn','crab','crisps','croissant','dairy','dessert','dragon-fruit','eggplant','eggs','finished-dish','finocchio','fish','flour','fries','grapes','hazelnut','hot-dog','ice-cream','jam','jamon','jelly','kebab','kiwi','kohlrabi','leek','lemon','lettuce','meat','melon','muffins','mushroom','naan','noodles','nuts','olive-oil','olives','onions','oranges','pancakes','papaya','pastry','peaches','pears','peas','peppers','pet-food','pie','pineapple','pizza','plum','pomegranate','porridge','potato','prawns','pretzel','pumpkin','quesadilla','radish','raspberry','rice','salami','sauce','snacks','spaghetti','spices','spinach','sprout','steak','strawberry','sweet-potato','sweetener','taco','tin-food','tomato','watermelon','wrap','zucchini']
}

function addItemSuccess(state, item) {
  const items = [...state.items]
  items.push(item)
  return updateObject(state, { loading: false, item: item, items: items, added: true })
}

function updateItemSuccess(state, item) {
  const items = [...state.items]
  const itemIndex = items.findIndex(it => it.id === item.id)
  items[itemIndex] = item
  return updateObject(state, { loading: false, item: item, items: items, added: true })
}

function deleteItemSuccess(state, itemId) {
  const items = [...state.items]
  const itemIndex = items.findIndex(it => it.id === itemId)
  items.splice(itemIndex, 1)
  return updateObject(state, { loading: false, items: items, deleted: true })
}

export default function fridge(state = initialState, action) {
  switch(action.type) {
    case AT.FRIDGE_FETCH_ITEMS:
    return updateObject(state, { loading: true, added: false, error: null } )
    case AT.FRIDGE_FETCH_ITEMS_SUCCESS:
    return updateObject(state, { loading: false, items: action.items })
    case AT.FRIDGE_FETCH_ITEMS_ERROR:
    return updateObject(state, { loading: false, error: action.error })
    case AT.FRIDGE_ADD_ITEM:
    return updateObject(state, { loading: true, added: false, error: null } )
    case AT.FRIDGE_ADD_ITEM_SUCCESS:
    return addItemSuccess(state, action.item)
    case AT.FRIDGE_ADD_ITEM_ERROR:
    return updateObject(state, { loading: false, error: action.error, added: false })
    case AT.FRIDGE_FETCH_ITEM:
    return updateObject(state, { loading: true, item: [], error: null } )
    case AT.FRIDGE_FETCH_ITEM_SUCCESS:
    return updateObject(state, { loading: false, item: action.item })
    case AT.FRIDGE_FETCH_ITEM_ERROR:
    return updateObject(state, { loading: false, error: action.error })
    case AT.FRIDGE_UPDATE_ITEM:
    return updateObject(state, { loading: true, item: [], added: false, error: null } )
    case AT.FRIDGE_UPDATE_ITEM_SUCCESS:
    return updateItemSuccess(state, action.item)
    case AT.FRIDGE_UPDATE_ITEM_ERROR:
    return updateObject(state, { loading: false, error: action.error, added: false })
    case AT.FRIDGE_DELETE_ITEM:
    return updateObject(state, { loading: true, item: [], deleted: false, error: null } )
    case AT.FRIDGE_DELETE_ITEM_SUCCESS:
    return deleteItemSuccess(state, action.itemId)
    case AT.FRIDGE_DELETE_ITEM_ERROR:
    return updateObject(state, { loading: false, error: action.error, deleted: false })
    default:
    return state;
  }
}
