const jwt = require('jsonwebtoken')
secret = 'noasdN2A123!!!@#@3$%sfdfnsfkakaksdkasdlad'

const withAuth = function(req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token
  if (!token) {
    res.status(202).send('Unauthorized: No token provided')
  } else {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(202).send('Unauthorized: Invalid token')
      } else {
        req.username = decoded.username
        next()
      }
    })
  }
}

module.exports = withAuth