import * as AT from '../actionTypes'
import updateObject from '../../utils/updateObject'

const initialState = {
  items: [],
  loading: false,
  error: false,
  added: false,
  types: ['apricot','asparagus','avocado','bacon','baguette','banana','beetroot','brazil-nut','bread','broccoli','burger','cabbage','cake','candy','carrot','celery','cheese','chili-pepper','chocolate','cinnamon-sticks','coconut','corn','crab','crisps','croissant','dairy','dessert','dragon-fruit','eggplant','eggs','finished-dish','finocchio','fish','flour','fries','grapes','hazelnut','hot-dog','ice-cream','jam','jamon','jelly','kebab','kiwi','kohlrabi','leek','lemon','lettuce','meat','melon','muffins','mushroom','naan','noodles','nuts','olive-oil','olives','onions','oranges','pancakes','papaya','pastry','peaches','pears','peas','peppers','pet-food','pie','pineapple','pizza','plum','pomegranate','porridge','potato','prawns','pretzel','pumpkin','quesadilla','radish','raspberry','rice','salami','sauce','snacks','spaghetti','spices','spinach','sprout','steak','strawberry','sweet-potato','sweetener','taco','tin-food','tomato','watermelon','wrap','zucchini']
}

export default function fridge(state = initialState, action) {
  switch(action.type) {
    case AT.FRIDGE_FETCH_ITEMS:
    return updateObject(state, { loading: true, added: false } )
    case AT.FRIDGE_FETCH_ITEMS_SUCCESS:
    return updateObject(state, { loading: false, items: action.items })
    case AT.FRIDGE_FETCH_ITEMS_ERROR:
    return updateObject(state, { loading: false, error: action.error })
    case AT.FRIDGE_ADD_ITEM:
    return updateObject(state, { loading: true, added: false } )
    case AT.FRIDGE_ADD_ITEM_SUCCESS:
    return updateObject(state, { loading: false, item: action.item , added: true })
    case AT.FRIDGE_ADD_ITEM_ERROR:
    return updateObject(state, { loading: false, error: action.error, added: false })
    default:
    return state;
  }
}
