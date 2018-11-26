// Express Set-up
const express = require('express')
const app = express()
const router = express.Router()
const port = 5000
const bodyParser = require('body-parser')
const fridgeItemsFile = './fridgeItems.json'

// Require fileSystem to be able to work with JSON files
const fs = require('fs')

// Requiring data validation function
const dataValidation = require('./dataValidation')

// Setting /api as the default route for API requests, Body Parser & settings headers for a RestAPI
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
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

// GET request for fridge items, will load hard coded JSON for now
router.get('/fridge', (req, res) => {
  fs.readFile(fridgeItemsFile, (error, data) => {
    if (error) {
      res.send('READING_ERROR')
    } else {
      res.json(fridgeItems)
    }
  })
})

// GET request for a specific fridge item
router.get('/fridge/:id', (req, res) => {
  fs.readFile(fridgeItemsFile, (error, data) => {
    if (error) {
      res.send('READING_ERROR')
    } else {
      const fridgeItems = JSON.parse(data)
      const fridgeItem = fridgeItems.find(item => item.id === req.params.id)
      if (fridgeItem) {
        res.json(fridgeItem)
      } else {
        res.send('NOT_FOUND')
      }
    }
  })
})

// PUT request to update a specific fridge item
router.put('/fridge/:id', (req, res) => {
  fs.readFile(fridgeItemsFile, (error, data) => {
    if (error) {
      res.send('READING_ERROR')
    } else {
      let fridgeItems = JSON.parse(data)
      const fridgeItem = fridgeItems.find(item => item.id === req.params.id)
      if (fridgeItem) {
        const fridgeItemIndex = fridgeItems.findIndex(item => item.id === req.params.id)
        const receivedItem = { ...req.body }
        let itemValid = true
        const editedItem = {}
        for (let key in receivedItem) {
          itemValid = dataValidation.check(receivedItem[key].value, receivedItem[key].validation)
          editedItem[key] = receivedItem[key].value
        }
        if (itemValid) {
          fridgeItems[fridgeItemIndex] = { ...fridgeItem, ...editedItem }
          fs.writeFile(fridgeItemsFile, JSON.stringify(fridgeItems), err => {
            if (err) {
              res.send('WRITING_ERROR')
            } else {
              res.send('SUCCESS')
            }
          })
        } else {
          res.send('INVALID_DATA')
        }
      } else {
        res.send('NOT_FOUND')
      }
    }
  })
})

// POST request to add a new fridge item, will add to JSON file for now
router.post('/fridge', (req, res) => {
  fs.readFile(fridgeItemsFile, (error, data) => {
    if (error) {
      res.send('READING_ERROR')
    } else {
      const receivedItem = { ...req.body }
      let itemValid = true
      const newItem = {}
      for (let key in receivedItem) {
        itemValid = (key === "id") ? true : dataValidation.check(receivedItem[key].value, receivedItem[key].validation)
        newItem[key] = receivedItem[key].value
      }
      if (itemValid) {
        const fridgeItems = JSON.parse(data)
        fridgeItems.push(newItem)
        fs.writeFile(fridgeItemsFile, JSON.stringify(fridgeItems), err => {
          if (err) {
            res.send('WRITING_ERROR')
          } else {
            res.send('SUCCESS')
          }
        })
      } else {
        res.send('INVALID_DATA')
      }
    }
  })
})

// POST request to delete a specific fridge item
router.post('/fridge/delete/:id', (req, res) => {
  fs.readFile(fridgeItemsFile, (error, data) => {
    if (error) {
      res.send('READING_ERROR')
    } else {
      let fridgeItems = JSON.parse(data)
      const fridgeItem = fridgeItems.find(item => item.id === req.params.id)
      if (fridgeItem) {
        const fridgeItemIndex = fridgeItems.findIndex(item => item.id === req.params.id)
        fridgeItems.splice(fridgeItemIndex, 1)
        fs.writeFile(fridgeItemsFile, JSON.stringify(fridgeItems), err => {
          if (err) {
            res.send('WRITING_ERROR')
          } else {
            res.send('SUCCESS')
          }
        })
      } else {
        res.send('NOT_FOUND')
      }
    }
  })
})

app.listen(port, () => console.log(`Server listening on port ${port}`))
