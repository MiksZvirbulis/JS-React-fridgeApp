const jwt = require('jsonwebtoken')
secret = 'noasdN2A123!!!@#@3$%sfdfnsfkakaksdkasdlad'

const withAuth = function(req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token
  if (!token) {
    res.status(202).send('Unauthorised: No token provided')
  } else {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(202).send('Unauthorised: Invalid token')
      } else {
        req.username = decoded.username
        connection.query("SELECT u.id AS uId, f.id AS fId FROM users u LEFT JOIN fridges f ON f.user_id = u.id WHERE `username` = ?", [req.username], (findUserError, findUserResult) => {
          if (findUserError) {
            console.log(findUserError)
          } else if (findUserResult.length === 0) {
            console.log("No user found")
          } else {
            req.userId = findUserResult[0].uId
            req.fridgeId = findUserResult[0].fId
            next()
          }
        })
      }
    })
  }
}

module.exports = withAuth