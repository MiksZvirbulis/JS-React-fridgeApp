// Handling all routes for fridge requests

// Get all items

exports.list = (req, res) => {
    // Query for all items
    connection.query('SELECT * FROM `items` WHERE `fridge_id` = ?', [req.params.id], (error, items) => {
        if (error) {
            // Send for error handling if query failed
            res.sendStatus(202)
        } else {
            // Send JSON with query results
            res.json(items)
        }
    })
}

// Get invidiual item

exports.item = (req, res) => {
    // Query to select an item with ID attached to request
    connection.query('SELECT * FROM `items` WHERE `id` = ?', [req.params.id], (error, item) => {
        if (error) {
            // Send for error handling if query failed
            res.send('READING_ERROR')
        } else {
            // Check if item was found in database
            if (item.length === 0) {
                // Send for error handling if item was not found in database
                res.send('NOT_FOUND')
            } else {
                // Receive item from database and send back as JSON
                res.json(item[0])
            }
        }
    })
}

// Update individual item

exports.updateItem = (req, res) => {
    // Query to select an item with ID attached to request
    connection.query('SELECT * FROM `items` WHERE `id` = ?', [req.params.id], (error, item) => {
        if (error) {
            // Send for error handling if query failed
            res.send('READING_ERROR')
        } else {
            // Check if item was found in database
            if (item.length === 0) {
                // Send for error handling if item was not found in database
                res.send('NOT_FOUND')
            } else {
                // Check validation of item received in the body of the request
                const receivedItem = {
                    ...req.body
                }
                // Initially valid
                let itemValid = true
                const editedItem = {}
                for (let key in receivedItem) {
                    // Each key is looped and tested for validation according to validation rules attached to request
                    itemValid = dataValidation.check(receivedItem[key].value, receivedItem[key].validation)
                    editedItem[key] = receivedItem[key].value
                }
                // Check if itemValid = true
                if (itemValid) {
                    // Query to update the item values
                    connection.query('UPDATE `items` SET `name` = ?, `weight` = ?, `type` = ?, `expiryDate` = ?, `comment` = ?, `open` = ? WHERE `id` = ?', [
                        editedItem['name'],
                        editedItem['weight'],
                        editedItem['type'],
                        editedItem['expiryDate'],
                        editedItem['comment'],
                        editedItem['open'],
                        req.params.id
                    ], (error, item) => {
                        if (error) {
                            // Send for error handling if updating query was not successful
                            res.send('WRITING_ERROR')
                        } else {
                            // Send for SUCCESS as updating was successful
                            res.send('SUCCESS')
                        }
                    })
                } else {
                    // Send for error handling if item values were not valid
                    res.send('INVALID_DATA')
                }
            }
        }
    })
}

// Post a new item
exports.addItem = (req, res) => {
    // Check validation of item received in the body of the request
    const receivedItem = { ...req.body }
    let itemValid = true
    const newItem = {}
    for (let key in receivedItem) {
        // Each key is looped and tested for validation according to validation rules attached to request
        itemValid = (key === "id") ? true : dataValidation.check(receivedItem[key].value, receivedItem[key].validation)
        newItem[key] = receivedItem[key].value
    }
    // Check if itemValid = true
    if (itemValid) {
        // Query to insert the new item in the database
        connection.query('INSERT INTO `items` (`name`, `weight`, `type`, `expiryDate`, `comment`, `open`, `fridge_id`) VALUES (?, ?, ?, ?, ?, ?, ?)', [
            newItem['name'],
            newItem['weight'],
            newItem['type'],
            newItem['expiryDate'],
            newItem['comment'],
            newItem['open'],
            newItem['fridgeId']
        ], (error, result) => {
            if (error) {
                // Send for error handling if the insert query was not successful
                res.send('WRITING_ERROR')
            } else {
                // Send JSON with itemId as query was successful
                res.json({
                    itemId: result.insertId
                })
            }
        })
    } else {
        // Send for error handling if item values were not valid
        res.send('INVALID_DATA')
    }
}

// Delete an individual item

exports.deleteItem = (req, res) => {
    // Query to select an item with ID attached to request
    connection.query('SELECT `fridge_id` FROM `items` WHERE `id` = ?', [req.params.id], (findItemError, findItemResult) => {
        if (findItemError) {
            // Send for error handling if query failed
            res.send('READING_ERROR')
        } else {
            if (findItemResult.length === 0) {
                // Send for error handling if item was not found in database
                res.send('NOT_FOUND')
            } else {
                // Query to find all items with fridge_id found for item
                connection.query('SELECT `id` FROM `items` WHERE `fridge_id` = ?', [findItemResult[0].fridge_id], (findItemsError, findItemsResult) => {
                    if (findItemsError) {
                        // Send for error handling if the delete query was not successful
                        res.send('WRITING_ERROR')
                    } else {
                        // If fridge has more than 1 items, then proceed with deletion
                        if (findItemsResult.length > 1) {
                          // Query to delete the item with the associated item ID
                connection.query('DELETE FROM `items` WHERE `id` = ?', [req.params.id], (deleteItemError, deleteItemResult) => {
                    if (deleteItemError) {
                        // Send for error handling if the delete query was not successful
                        res.send('WRITING_ERROR')
                    } else {
                        // Send for SUCCESS as deletion was successful
                        res.send("SUCCESS")
                    }
                })
                // Otherwise, if there is only 1 or 0 items in the fridge, you may not continue
                } else {
                    res.send("ONLY_ONE_ITEM")
                }
                }
            })
            }
        }
    })
}

// Get all users with access to user's fridge

exports.getAccess = (req, res) => {
    // Query to select username's of users who have access to another user's fridge
    connection.query('SELECT u.username, u.id, f.user_access, f.user_id FROM users u LEFT JOIN fridges f ON JSON_CONTAINS(f.user_access, CAST(u.id as JSON), ?) WHERE f.user_id = ?', ['$', req.params.id], (error, users) => {
        if (error) {
            // Send for error handling if query failed
            res.status(202).send('READING_ERROR')
        } else {
            // Check if user was found in database
            if (users.length === 0) {
                // Send for error handling if no users have access
                res.status(202).send('NO_USER_HAS_ACCESS')
            } else {
                // Create array for users with access
                let usersWithAccess = []
                for (let key in users) {
                    usersWithAccess.push(users[key].username)
                }
                // Send users with access array as JSON
                res.status(200).json(usersWithAccess)
            }
        }
    })
}

// Give a specified user access to a new fridge

exports.giveAccess = (req, res) => {
    // Request body should receive user.username and user.userId
    const user = { ...req.body }
    // Query to find user in the database with username provided
    connection.query("SELECT `id` FROM `users` WHERE `username` = ?", [user.username], (findUserError, findUserResult) => {
        // If a user was found
        if (findUserResult.length > 0) {
            // Query that adds the specified user ID to the access array in the database
            connection.query("UPDATE `fridges` SET `user_access` = JSON_ARRAY_APPEND(`user_access`, '$', ?) WHERE `user_id` = ? AND NOT JSON_CONTAINS(`user_access`, '?')", [findUserResult[0].id, user.userId, findUserResult[0].id], (updateAccessError, updateAccessResult) => {
                if (updateAccessError) {
                    // Testing if the user already has access is. This is just to send for error handling if query fails
                    res.status(202).send('USER_HAS_ACCESS')
                } else {
                    res.status(200).send('SUCCESS')
                }
            })
        } else {
            // If a user was not found, sending for error handling
            res.status(202).send('USER_NOT_FOUND')
        }
    })
}

// Give a specified user access to a new fridge

exports.deleteAccess = (req, res) => {
    // Request body should receive user.username and user.userId
    const user = { ...req.body }
    // Query to find user in the database with username provided
    connection.query("SELECT `id` FROM `users` WHERE `username` = ?", [user.username], (findUserError, findUserResult) => {
        // If a user was found
        if (findUserResult.length > 0) {
            // Query that adds the specified user ID to the access array in the database
            connection.query("UPDATE `fridges` SET `user_access` = JSON_REMOVE(`user_access`, '$', ?) WHERE `user_id` = ? AND JSON_CONTAINS(`user_access`, '?')", [findUserResult[0].id, user.userId, findUserResult[0].id], (updateAccessError, updateAccessResult) => {
                if (updateAccessError) {
                    // Testing if the actually user has access is. This is just to send for error handling if query fails
                    res.status(202).send('USER_HAS_NO_ACCESS')
                } else {
                    res.status(200).send('SUCCESS')
                }
            })
        } else {
            // If a user was not found, sending for error handling
            res.status(202).send('USER_NOT_FOUND')
        }
    })
}

// Get all fridges that user has access to

exports.getFridges = (req, res) => {
    // Query that selects ALL fridges which user id provided in the request parameters has access to
    connection.query("SELECT `id`, `title` FROM `fridges` WHERE JSON_CONTAINS(`user_access`, ?)", [req.params.id], (findFridgesError, findFridgesResult) => {
        if (findFridgesError) {
            // Query error, sending for error handling
            console.log(findFridgesError)
            res.status(202).send('READING_ERROR')
        } else {
            const fridges = []
            for (let key in findFridgesResult) {
                fridges.push({ value: findFridgesResult[key].id, display: findFridgesResult[key].title })
            }
            // Sending successful JSON array with found fridges
            res.status(200).json(fridges)
        }
    })
}