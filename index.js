// Add my enviournment variables
require('dotenv').config()

// Require node modules that you need
var express = require('express')
var layouts = require('express-ejs-layouts')
var geocoder = require('simple-geocoder')
var request = require('request');

// Declare your app
var app = express()

// Tell express what view engine you want to use
app.set('view engine', 'ejs')

// Include any middleware here
app.use(layouts)
app.use(express.static('static'))
app.use(express.urlencoded({ extended: false }))

// Declare routes
app.get('/', function(req, res){
  res.render('home')
})

app.post('/results', function(req, res) {
  geocoder.geocode(req.body.location, function(success, locations) {
    console.log(req.body)

    if (success) {
      var urlToCall = process.env.DARK_SKY_BASE_URL + locations.y + "," + locations.x
      console.log(`urlToCall: ${urlToCall}`)
      console.log(locations)
      console.log("Success!")
      request(urlToCall, function(error, response, body) {
        if(error || response.statusCode != 200) {
          console.log('error', error)
          console.log('status code', response && response.statusCode)
          console.log('body:', body);
          res.send('Oops - check logs')
        } else {
          var results = JSON.parse(body)
          var daily = results.daily
          var current = results.current

          res.render('result', {
            locations:req.body.location, // will be the string "Seattle, WA"
            temperature: results.temperature,
            daily: results.daily,
            results: results
          })
        }
      })
    }
    
  })
})


// Listen on PORT 3000
app.listen(3000, function() {
  console.log('I\'m listening to the smooth sounds of port 3000 in the morning. ☕')
})
