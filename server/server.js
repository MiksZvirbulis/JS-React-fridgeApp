// Express Set-up
const express = require('express')
const app = express()
const router = express.Router()
const port = 5000
const bodyParser = require('body-parser')
const fridgeItemsFile = './fridgeItems.json'

// Database
let mysql = require('mysql')
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'miks',
  password: 'password1',
  database: 'fridge'
})

connection.connect()

// Require fileSystem to be able to work with JSON files
const fs = require('fs')

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

// Requiring fridge item JSON file
const fridgeItems = require(fridgeItemsFile)

// GET request for fridge items
router.get('/fridge', (req, res) => {
  connection.query('SELECT * FROM `items`', (error, items) => {
    if (error) {
      res.send('READING_ERROR')
    } else {
      res.json(items)
    }
  })
})

// GET request for a specific fridge item
router.get('/fridge/:id', (req, res) => {
  connection.query('SELECT * FROM `items` WHERE `id` = ?', [req.params.id], (error, item) => {
    if (error) {
      res.send('READING_ERROR')
    } else {
      if (item.length === 0) {
        res.send('NOT_FOUND')
      } else {
        res.json(item[0])
      }
    }
  })
})

// PUT request to update a specific fridge item
router.put('/fridge/:id', (req, res) => {
  connection.query('SELECT * FROM `items` WHERE `id` = ?', [req.params.id], (error, item) => {
    if (error) {
      res.send('READING_ERROR')
    } else {
      if (item.length === 0) {
        res.send('NOT_FOUND')
      } else {
        const receivedItem = { ...req.body }
        let itemValid = true
        const editedItem = {}
        for (let key in receivedItem) {
          itemValid = dataValidation.check(receivedItem[key].value, receivedItem[key].validation)
          editedItem[key] = receivedItem[key].value
        }
        if (itemValid) {
          connection.query('UPDATE `items` SET `name` = ?, `weight` = ?, `type` = ?, `expiryDate` = ?, `comment` = ?, `open` = ? WHERE `id` = ?', [
            editedItem['name'],
            editedItem['weight'],
            editedItem['type'],
            editedItem['expiryDate'],
            editedItem['comment'],
            editedItem['open'],
            req.params.id
          ], (error, item) => {
            if(error) {
              res.send('WRITING_ERROR')
            } else {
              res.send('SUCCESS')
            }
          })
        } else {
          res.send('INVALID_DATA')
        }
      }
    }
  })
})

// POST request to add a new fridge item
router.post('/fridge', (req, res) => {
  const receivedItem = { ...req.body
  }
  let itemValid = true
  const newItem = {}
  for (let key in receivedItem) {
    itemValid = (key === "id") ? true : dataValidation.check(receivedItem[key].value, receivedItem[key].validation)
    newItem[key] = receivedItem[key].value
  }
  if (itemValid) {
    connection.query('INSERT INTO `items` (`name`, `weight`, `type`, `expiryDate`, `comment`, `open`) VALUES (?, ?, ?, ?, ?, ?)', [
      newItem['name'],
      newItem['weight'],
      newItem['type'],
      newItem['expiryDate'],
      newItem['comment'],
      newItem['open']
    ], (error, result) => {
      if (error) {
        res.send('WRITING_ERROR')
      } else {
        res.json({
          itemId: result.insertId
        })
      }
    })
  } else {
    res.send('INVALID_DATA')
  }
})

// POST request to delete a specific fridge item
router.post('/fridge/delete/:id', (req, res) => {
  connection.query('SELECT * FROM `items` WHERE `id` = ?', [req.params.id], (error, item) => {
    if (error) {
      res.send('READING_ERROR')
    } else {
      if (item.length === 0) {
        res.send('NOT_FOUND')
      } else {
        connection.query('DELETE FROM `items` WHERE `id` = ?', [req.params.id], (error, item) => {
          if(error) {
            res.send('WRITING_ERROR')
          } else {
            res.send("SUCCESS")
          }
        })
      }
    }
  })
})

app.listen(port, () => console.log(`Server listening on port ${port}`))