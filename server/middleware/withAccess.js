const hasAccess = require('../utils/hasAccess')

const withAccess = async function(req, res, next) {
  
  // Is the username included in the request?

  if (req.username) {
    // Raw request path
    let rawPath = req.path.split('/')
    // This will split the path and remove the first and last items, as they are useless
    let pathType = req.path.split('/')
    pathType.pop()
    pathType.shift()
    // To figure out if the request is GET, POST, PUT or DELETE
    let pathMethod = req.method

    // Is the request for fridge routes?

    if (pathType[0] === 'fridge') {
      
      // Is the method GET and requesting a list of all items in a fridge? Also handling for GET user list with access to fridge
      
      if (pathMethod === 'GET' && (pathType[1] === 'items' || pathType[1] === 'access')) {
          // Awaiting for utility function to return if user has access to fridge or not
            const hasAccessToFridge = hasAccess.toFridge(req.username, rawPath[3])
            .then(access => {
            if (access === true) {
              // Has access! Continue to route
              return next()
            } else {
              // Has no access, therefore sending 403
              return res.status(403).send('No Access')
            }
            })

          // Is the method GET and requesting for an individual item?

        } else if ((pathMethod === 'GET' || pathMethod === 'PUT' || pathMethod === 'DELETE') && pathType[1] === 'item') {
          // Query that finds the requested item and selecting the fridgeId from it
          connection.query('SELECT `fridge_id` FROM `items` WHERE `id` = ?', [rawPath[3]], (findItemError, findItemResult) => {
            if (findItemError || findItemResult.length === 0) {
              // Checking if query has errors OR if no item was found, then send message
              return res.status(200).send('Item not found')
            } else {
              // Awaiting for utility function to return if user has access to fridge or not
            const hasAccessToFridge = hasAccess.toFridge(req.username, findItemResult[0].fridge_id)
            .then(access => {
            if (access === true) {
              // Has access! Continue to route
              return next()
            } else {
              // Has no access, therefore sending 403
              return res.status(403).send('No Access')
            }
            })
            }
          })

          // Handling routes for posting new item and giving access to fridge

        } else if (pathMethod === 'POST' && (rawPath[2] === 'item' || rawPath[2] === 'access')) {
          let fridgeId = null
          // Data received in the body
          const receivedData = { ...req.body }
          if (rawPath[2] === 'item') {
            // If posted new item, fridgeId is stored differently
            fridgeId = receivedData.fridgeId.value
          } else {
            // If giving access, fridgeId is stored differently
            fridgeId = receivedData.fridgeId
          }
          // Awaiting for utility function to return if user has access to fridge or not
          const hasAccessToFridge = hasAccess.toFridge(req.username, fridgeId)
            .then(access => {
            if (access === true) {
              // Has access! Continue to route
              return next()
            } else {
              // Has no access, therefore sending 403
              return res.status(403).send('No Access')
            }
            })

          // Routes are handled above, if in the case they are not, then unauthorised

        } else { res.status(403).send('Unauthorised') }
    }

    // Username does not exist in the request, so returning unauthorised

  } else {
    res.status(403).send('Unauthorised')
  }
}

module.exports = withAccess