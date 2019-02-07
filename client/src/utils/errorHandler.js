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
    default:
    return error
  }

}

export default errorHandler
