import * as AT from '../actionTypes'
import updateObject from '../../utils/updateObject'

const initialState = {
    error: null,
    loading: false,
    signedUp: false,
    loggedIn: false,
    userId: null,
    fridgeId: null,
    newLogin: false
}


export default function auth(state = initialState, action) {
    switch (action.type) {
        case AT.AUTH_SIGNUP:
        return updateObject(state, { error: null, signedUp: false })
        case AT.AUTH_SIGNUP_SUCCESS:
        return updateObject(state, { error: null, signedUp: true })
        case AT.AUTH_SIGNUP_ERROR:
        return updateObject(state, { error: action.error, signedUp: false })
        case AT.AUTH_UPDATE_SIGNUP:
        return updateObject(state, { signedUp: false })
        case AT.AUTH_LOGIN:
        return updateObject(state, { error: null, loggedIn: false, userId: null, newLogin: false })
        case AT.AUTH_LOGIN_SUCCESS:
        return updateObject(state, { error: null, loggedIn: true, userId: action.userId, fridgeId: action.fridgeId, newLogin: true })
        case AT.AUTH_LOGIN_ERROR:
        return updateObject(state, { error: action.error, loggedIn: false })
        case AT.AUTH_LOGOUT:
        return updateObject(state, { error: null, loggedIn: false, userId: null, fridgeId: null })
        case AT.AUTH_LOGOUT_SUCCESS:
        return updateObject(state, { error: null })
        case AT.AUTH_LOGOUT_ERROR:
        return updateObject(state, { error: action.error })
        case AT.AUTH_IS_LOGGED_IN:
        return updateObject(state, { error: null, loggedIn: false, userId: null, fridgeId: null, newLogin: false })
        case AT.AUTH_IS_LOGGED_IN_SUCCESS:
        return updateObject(state, { loggedIn: true, userId: action.userId, fridgeId: action.fridgeId, error: null })
        case AT.AUTH_IS_LOGGED_IN_ERROR:
        return updateObject(state, { loggedIn: false, userId: null, fridgeId: null })
        default:
            return state;
    }
}