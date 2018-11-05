// Express Set-up
const express = require('express')
const app = express()
const router = express.Router()
const port = 5000
const bodyParser = require('body-parser')
const fridgeItemsFile = './fridgeItems.json'

// Require fileSystem to be able to work with JSON files
const fs = require('fs')

// Setting /api as the default route for API requests, Body Parser & settings headers for a RestAPI
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', router)
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE")
    return res.status(200).json({})
  }
  next();
});

// Requiring fridge item JSON file
const fridgeItems = require(fridgeItemsFile)

// GET request for fridge items, will load hard coded JSON for now
router.get('/fridge', (req, res) => {
  res.json(fridgeItems)
})

// POST request to add a new fridge item, will add to JSON file for now
router.post('/fridge', (req, res) => {
  fs.readFile(fridgeItemsFile, (error, data) => {
    if (error) {
      res.send('Error occured while reading file!')
    } else {
      const fridgeItems = JSON.parse(data)
      fridgeItems.push(req.body)
      fs.writeFile(fridgeItemsFile, JSON.stringify(fridgeItems), err => {
        if (err) {
          res.send('Error occured while writing to file!')
        } else {
          res.send('Success writing to file!')
        }
      })
    }
  })
})

// PUT request to update an existing fridge item, will update to JSON file for now
router.put('/fridge', (req, res) => {
  res.send("A request to update an existing item")
})

app.listen(port, () => console.log(`Server listening on port ${port}`))
