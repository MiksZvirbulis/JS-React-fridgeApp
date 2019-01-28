// Express Set-up
const express = require('express')
const app = express()
const router = express.Router()
const port = 5000
const bodyParser = require('body-parser')

// Database
let mysql = require('mysql')
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'miks',
  password: 'password1',
  database: 'fridge'
})

connection.connect()

// Requiring data validation function
const dataValidation = require('./dataValidation')

// Setting /api as the default route for API requests, Body Parser & settings headers for a RestAPI
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use('/api', router)
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
    return res.status(200).json({})
  }
  next();
});

// GET request for fridge items
router.get('/fridge', (req, res) => {
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
})

// GET request for a specific fridge item
router.get('/fridge/:id', (req, res) => {
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
})

// PUT request to update a specific fridge item
router.put('/fridge/:id', (req, res) => {
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
        const receivedItem = { ...req.body
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
})

// POST request to add a new fridge item
router.post('/fridge', (req, res) => {
  // Check validation of item received in the body of the request
  const receivedItem = { ...req.body
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
})

// POST request to delete a specific fridge item
router.post('/fridge/delete/:id', (req, res) => {
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
})

app.listen(port, () => console.log(`Server listening on port ${port}`))