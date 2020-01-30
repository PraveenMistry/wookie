const dotenv  = require('dotenv').config();
const express   = require('express')
const bodyParser = require('body-parser')
const app       = express()
const port      = process.env.PORT || 8080

app.use(bodyParser.json())
app.use( 
  bodyParser.urlencoded({
    extended: false
  })
)


var user = require('./routes/user')
var book = require('./routes/book')

app.use('/', user)
app.use('/', book)

app.listen(port, function() {
  console.log('Server is running on port: ' + port)
})

module.exports = app