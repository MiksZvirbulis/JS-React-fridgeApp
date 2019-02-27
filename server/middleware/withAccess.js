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
        } else if ((pathMethod === 'GET' || pathMethod === 'PUT' || pathMethod === 'DELETE') && (pathType[1] === 'item' && pathType[1] === 'access')) {
          console.log(pathMethod)
          connection.query('SELECT `fridge_id` FROM `items` WHERE `id` = ?', [rawPath[3]], (findItemError, findItemResult) => {
            const hasAccessToFridge = hasAccess.toFridge(req.username, findItemResult[0].fridge_id)
            .then(access => {
            if (access === true) {
              return next()
            } else {
              return res.status(202).send('No Access')
            }
            })
          })
          // Do something here
        } else if (pathMethod === 'POST' && rawPath[2] === 'item') {
          const receivedItem = { ...req.body }
          console.log(req.body['fridgeId'].value)
          const hasAccessToFridge = hasAccess.toFridge(req.username, req.body['fridgeId'].value)
            .then(access => {
            if (access === true) {
              return next()
            } else {
              return res.status(202).send('No Access')
            }
            })
          // Do something here
        } else { return next() }
    }
  } else {
    res.status(202).send('Unauthorized')
  }
}

module.exports = withAccess