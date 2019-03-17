import * as AT from '../actionTypes'
import axios from 'axios'

const API_URL = 'https://fridge-app-miks.herokuapp.com/api/auth'

// SIGNUP

const authSignup = () => { return { type: AT.AUTH_SIGNUP } }

const authSignupSuccess = () => { return { type: AT.AUTH_SIGNUP_SUCCESS } }

const authSignupError = error => { return { type: AT.AUTH_SIGNUP_ERROR, error } }

export const authSignupAsync = user => {
    return async dispatch => {
        dispatch(authSignup());
        try {
            const response = await axios.post(API_URL, user)
            if (response.data === 'SUCCESS') {
                dispatch(authSignupSuccess())
            } else {
                dispatch(authSignupError(response.data))
            }
        } catch (error) {
            dispatch(authSignupError(error.message))
        }
    }
}

export const updateSignUp = () => { return { type: AT.AUTH_UPDATE_SIGNUP } }

// LOGIN

const authLogin = () => { return { type: AT.AUTH_LOGIN } }

const authLoginSuccess = userData => { return { type: AT.AUTH_LOGIN_SUCCESS, userId: userData.userId, fridgeId: userData.fridgeId } }

const authLoginError = error => { return { type: AT.AUTH_LOGIN_ERROR, error } }

export const authLoginAsync = userData => {
    return async dispatch => {
        dispatch(authLogin());
        try {
            const response = await axios.post(API_URL + '/login', userData, { withCredentials: true })
            if (response.status === 200) {
                dispatch(authLoginSuccess(response.data))
            } else {
                dispatch(authLoginError(response.data))
            }
        } catch (error) {
            dispatch(authLoginError(error.message))
        }
    }
}

// LOGOUT

const authLogout = () => { return { type: AT.AUTH_LOGOUT } }

const authLogoutSuccess = () => { return { type: AT.AUTH_LOGOUT_SUCCESS } }

const authLogoutError = error => { return { type: AT.AUTH_LOGOUT_ERROR, error } }

export const authLogoutAsync = userData => {
    return async dispatch => {
        dispatch(authLogout());
        try {
            const response = await axios.post(API_URL + '/logout', userData, { withCredentials: true })
            if (response.status === 200) {
                dispatch(authLogoutSuccess())
            } else {
                dispatch(authLogoutError(response.data))
            }
        } catch (error) {
            dispatch(authLogoutError(error.message))
        }
    }
}

// Is Logged In?

const authIsLoggedIn = () => { return { type: AT.AUTH_IS_LOGGED_IN } }

const authIsLoggedInSuccess = userData => { return { type: AT.AUTH_IS_LOGGED_IN_SUCCESS, userId: userData.userId, fridgeId: userData.fridgeId } }

const authIsLoggedInError = () => { return { type: AT.AUTH_IS_LOGGED_IN_ERROR } }

export const authIsLoggedInAsync = () => {
    return async dispatch => {
        dispatch(authIsLoggedIn());
        try {
            const response = await axios.get(API_URL + '/check', { withCredentials: true })
            if (response.status === 200) {
                dispatch(authIsLoggedInSuccess(response.data))
            } else {
                dispatch(authIsLoggedInError())
            }
        } catch (error) {
            dispatch(authIsLoggedInError())
        }
    }
}