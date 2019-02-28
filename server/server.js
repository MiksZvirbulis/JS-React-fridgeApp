// Express Set-up
const express = require('express')
const router = express.Router()
const port = process.env.PORT || 5000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

// Requiring Routes
const auth = require('./routes/auth')
const fridge = require('./routes/fridge')

const app = express()

// Database
const mysql = require('mysql')
connection = mysql.createConnection({
  host: 'localhost',
  user: 'miks',
  password: 'password1',
  database: 'fridge'
})
connection.connect()

// Setting /api as the default route for API requests, Body Parser & setting headers for a RestAPI
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cookieParser())
app.use('/api', router)
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
    return res.status(200).json({})
  }
  next();
});

// Requiring utilities & middleware
dataValidation = require('./utils/dataValidation')
const withAuth = require('./middleware/withAuth')
const withAccess = require('./middleware/withAccess')

//FRIDGE ROUTES
// GET request for fridge items with ID specified
router.get('/fridge/items/:id', withAuth, withAccess, fridge.list)
// GET request for a specific fridge item
router.get('/fridge/item/:id', withAuth, withAccess, fridge.item)
// PUT request to update a specific fridge item
router.put('/fridge/item/:id', withAuth, withAccess, fridge.updateItem)
// POST request to add a new fridge item
router.post('/fridge/item', withAuth, withAccess, fridge.addItem)
// DELETE request to delete a specific fridge item
router.delete('/fridge/item/:id', withAuth, withAccess, fridge.deleteItem)
// GET request to find all users with access to user's fridge
router.get('/fridge/access/:id', withAuth, withAccess, fridge.getAccess)
// DELETE request to remove fridge access to specified user
router.delete('/fridge/access/:id', withAuth, withAccess, fridge.deleteAccess)
// POST request to give fridge access to specified user
router.post('/fridge/access', withAuth, withAccess, fridge.giveAccess)
// GET all fridges which user has access to
router.get('/fridge/all/:id', withAuth, fridge.getFridges)

// AUTH ROUTES
// POST request to signup a new user
router.post('/auth', auth.signup)
// POST request to find if login successful
router.post('/auth/login', auth.login)
// POST request to find log user out
router.post('/auth/logout', withAuth, auth.logout)
// Check if logged in
router.get('/auth/check', withAuth, (req, res) => { res.status(200).json({ userId: req.userId, fridgeId: req.fridgeId}) })

app.listen(port, () => console.log(`Server listening on port ${port}`))