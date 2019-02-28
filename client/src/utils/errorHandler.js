const errorHandler = error => {

  switch(error) {
    case 'NOT_FOUND':
    return 'Item has not been found'
    case 'WRITING_ERROR':
    return 'There was an error writing to the database'
    case 'READING_ERROR':
    return 'There was an error reading from the database'
    case 'INVALID_DATA':
    return 'The data sent to the server is not valid'
    case 'Network Error':
    return 'There was an error while requesting data from the server'
    case 'SIGNUP_ERROR':
    return 'There was an error while signing you up'
    case 'USERNAME_TAKEN':
    return 'The username is already taken'
    case 'USER_NOT_FOUND':
    return 'User was not found'
    case 'USER_HAS_ACCESS':
    return 'User already has access to your fridge'
    case 'LOGIN_FAILED':
    return 'Username or password provided is incorrect'
    case 'NO_USER_HAS_ACCESS':
    return 'No users have access to your fridge'
    case 'USER_HAS_NO_ACCESS':
    return 'User does not have access to your fridge'
    case 'ONLY_ONE_ITEM':
    return 'You may not leave an empty fridge, add another item to delete this item'
    default:
    return error
  }

}

export default errorHandler
