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
        bcrypt.hash(user.password, 10, (checkHashError, hash) => {
            if (checkHashError) {
                res.send('SIGNUP_ERROR')
            } else {
                connection.query("SELECT `id` FROM `users` WHERE `username` = ?", [user.username], (findUserError, findUserResult) => {
                    if (findUserResult.length === 0) {
                        connection.query("INSERT INTO `users` (`username`, `password`) VALUES (?, ?)", [user.username, hash], (insertUserError, insertUserResult) => {
                            if (insertUserError) {
                                res.send('WRITING_ERROR')
                            } else {
                                connection.query("INSERT INTO `fridges` (`user_id`, `title`, `user_access`) VALUES (?, ?, ?)", [insertUserResult.insertId, user.username + "'s Fridge", '[' + insertUserResult.insertId + ']'], (insertFridgeError, insertFridgeResult) => {
                                    if (insertFridgeError) {
                                        res.send('WRITING_ERROR')
                                    } else {
                                        connection.query("INSERT INTO `items` (`name`, `weight`, `type`, `expiryDate`, `comment`, `open`, `fridge_id`) VALUES (?, ?, ?, ?, ?, ?, ?)", [
                                            'Sample Item',
                                            '500g',
                                            'no_type',
                                            '2018-11-29T00:00:00.000Z',
                                            'Sample item is branded Tesco, bought for dinner',
                                            'false',
                                            insertFridgeResult.insertId
                                        ], (insertItemError, insertItemResult) => {
                                            if (insertItemError) {
                                                res.send('WRITING_ERROR')
                                            } else {
                                                res.json('SUCCESS')
                                            }
                                        })
                                    }
                                })
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

    connection.query("SELECT u.password AS uPw, u.id AS uId, f.id AS fId FROM users u LEFT JOIN fridges f ON f.user_id = u.id WHERE `username` = ?", [username], (error, user) => {
        if (error) {
            res.status(202).send('READING_ERROR')
        } else {
            if(user.length === 0) {
                res.status(202).send('LOGIN_FAILED')
            } else {
            bcrypt.compare(password, user[0].uPw, (err, result) => {
                if (err) {
                    res.status(202).send('READING_ERROR')
                } else {
                    if (result === false) {
                        res.status(202).send('LOGIN_FAILED')
                    } else {
                        const payload = { username }
                        const token = jwt.sign(payload, secret, {
                            expiresIn: '1h'
                        })
                        res.cookie('token', token, { httpOnly: false }).status(200).json({ userId: user[0].uId, fridgeId: user[0].fId })
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