const hasAccess = require('../utils/hasAccess')

const withAccess = async function(req, res, next) {
  if (req.username) {
    let rawPath = req.path.split('/')
    let pathType = req.path.split('/')
    let pathMethod = req.method
    pathType.pop()
    pathType.shift()

    if (pathType[0] === 'fridge') {
      // Is the method GET and requesting a list of all items in a fridge?
        if (pathMethod === 'GET' && pathType[1] === 'items') {
            const hasAccessToFridge = hasAccess.toFridge(req.username, rawPath[3])
            .then(access => {
            if (access === true) {
              return next()
            } else {
              return res.status(202).send('No Access')
            }
            })
          // Is the method GET and requesting for an individual item?
        } else if (pathMethod === 'GET' && typeof pathType[1] === 'number') {
          // Do something here
        } else { return next() }
    }
  } else {
    res.status(202).send('Unauthorized')
  }
}

module.exports = withAccess