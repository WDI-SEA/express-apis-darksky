// Node modules needed
var express = require('express');
var layouts = require('express-ejs-layouts');
var parser = require('body-parser');
var geocoder = require('simple-geocoder');

// Node modules possibly needed
var cors = require('cors');
var path = require('path');
var request = require('request');

// Initialize environment
require('dotenv').config();

// Declare your app
var app = express();

// Tell express what view engine you want to use
app.set('view engine', 'ejs');

// Include any middleware here
app.use(layouts);
app.use(express.static('static'));
app.use(parser.urlencoded({ extended: false }));

// Declare routes
app.get('/', function(req, res){
  res.render('home');
});

app.post('/', function(req, res){
  let forecast;
  let place = req.body.place;
  // Geocoding
  geocoder.geocode(place, function ( success, data ) {
    if (success) {    
      // do something with data
      var longitude = data.x;
      var latitude = data.y;
      let url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${latitude},${longitude}`;
      console.log("Location: ", data.x, data.y);
      request(url, (error, response, body) => {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);
        // forecast = body.daily.data[0].summary;
        forecast = JSON.parse(body).daily.data[0].summary;
        console.log('forecast:', forecast);
        res.render('result', { 
          place: place,
          data: forecast
        });
      })
    }
  })
})

// Listen on PORT 3000
app.listen(3000, function(){
  console.log('I\'m listening to the smooth sounds of port 3000 in the morning. ☕');
});