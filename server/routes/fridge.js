// Handlinh all routes for fridge requests

exports.list = (req, res) => {
    // Query for all items
    connection.query('SELECT * FROM `items`', (error, items) => {
        if (error) {
            // Send for error handling if query failed
            res.send('READING_ERROR')
        } else {
            // Send JSON with query results
            res.json(items)
        }
    })
}

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

exports.addItem = (req, res) => {
    // Check validation of item received in the body of the request
    const receivedItem = {
        ...req.body
    }
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
        connection.query('INSERT INTO `items` (`name`, `weight`, `type`, `expiryDate`, `comment`, `open`) VALUES (?, ?, ?, ?, ?, ?)', [
            newItem['name'],
            newItem['weight'],
            newItem['type'],
            newItem['expiryDate'],
            newItem['comment'],
            newItem['open']
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

exports.deleteItem = (req, res) => {
    // Query to select an item with ID attached to request
    connection.query('SELECT * FROM `items` WHERE `id` = ?', [req.params.id], (error, item) => {
        if (error) {
            // Send for error handling if query failed
            res.send('READING_ERROR')
        } else {
            if (item.length === 0) {
                // Send for error handling if item was not found in database
                res.send('NOT_FOUND')
            } else {
                // Query to delete the item with the associated item ID
                connection.query('DELETE FROM `items` WHERE `id` = ?', [req.params.id], (error, item) => {
                    if (error) {
                        // Send for error handling if the delete query was not successful
                        res.send('WRITING_ERROR')
                    } else {
                        // Send for SUCCESS as deletion was successful
                        res.send("SUCCESS")
                    }
                })
            }
        }
    })
}