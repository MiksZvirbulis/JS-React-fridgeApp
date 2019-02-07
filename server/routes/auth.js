const bcrypt = require('bcrypt')
jwt = require('jsonwebtoken')
secret = 'noasdN2A123!!!@#@3$%sfdfnsfkakaksdkasdlad'

// Handling all routes for auth requests

exports.signup = (req, res) => {
    const receivedData = {
        ...req.body
    }

    let userValid = true
    const user = {}
    for (let key in receivedData) {
        // Each key is looped and tested for validation according to validation rules attached to request
        itemValid = dataValidation.check(receivedData[key].value, receivedData[key].validation)
        user[key] = receivedData[key].value
    }

    if (userValid) {
        bcrypt.hash(user.password, 10, (err, hash) => {
            if (err) {
                res.send('SIGNUP_ERROR')
            } else {
                connection.query("SELECT `id` FROM `users` WHERE `username` = ?", [user.username], (err, result) => {
                    if (result.length === 0) {
                        connection.query("INSERT INTO `users` (`username`, `password`) VALUES (?, ?)", [user.username, hash], (error, result) => {
                            if (error) {
                                res.send('WRITING_ERROR')
                            } else {
                                res.json('SUCCESS')
                            }
                        })
                    } else {
                        res.send('USERNAME_TAKEN')
                    }
                })
            }
        })
    } else {
        // Send for error handling if item values were not valid
        res.send('INVALID_DATA')
    }
}

exports.login = (req, res) => {
    const { username, password } = req.body;

    connection.query("SELECT `password` FROM `users` WHERE `username` = ?", [username], (error, user) => {
        if (error) {
            res.status(401).send('READING_ERROR')
        } else {
            if(user.length === 0) {
                res.status(401).send('LOGIN_FAILED')
            } else {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    res.status(401).send('READING_ERROR')
                } else {
                    if (result === false) {
                        res.status(401).send('LOGIN_FAILED')
                    } else {
                        const payload = { username }
                        const token = jwt.sign(payload, secret, {
                            expiresIn: '1h'
                        })
                        res.cookie('token', token, { httpOnly: true }).sendStatus(200)
                    }
                }
            })
        }
        }
    })
}

exports.logout = (req, res) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token

    if (token) {
        res.clearCookie('token').sendStatus(200);
    } else {
        res.status(401).send('Unauthorized: No token provided')
    }
}