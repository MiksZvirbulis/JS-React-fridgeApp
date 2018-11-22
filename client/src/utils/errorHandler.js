const errorHandler = error => {

  switch(error) {
    case 'NOT_FOUND':
    return 'Item has not been found'
    case 'WRITING_ERROR':
    return 'There was an error writing to the database'
    case 'READING_ERROR':
    return 'There was an error reading from the database'
    case 'Network Error':
    return 'There was an error while requesting data from the server'
    default:
    return error
  }

}

export default errorHandler
