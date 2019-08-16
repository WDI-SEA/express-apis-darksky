// Require node modules that you need
var express = require('express');
var layouts = require('express-ejs-layouts');
var parser = require('body-parser');
var geocoder = require('simple-geocoder');
var moment = require('moment')
// var locals = require('locals');
var request = require('request');

require('dotenv').config()


// Declare your app
var app = express();

// Tell express what view engine you want åto use
app.set('view engine', 'ejs');

// Include any middleware here

app.use(layouts);
app.use(express.static('static'));
app.use(parser.urlencoded({ extended: false }));

let icons = {
  "partly-cloudy-day": '☀️',
  "cloudy": '☁️',
  "partly-cloudy-day": '🌥'
  // cloudy: 
}
// use cdn to add weather icons 

// Declare routes
app.get('/', function(req, res){
  res.render('home');
});

app.post('/results', function(req, res){

  geocoder.geocode(req.body.name, (success, locations) => {
    if (success) {
      var lat = locations.y;
      var lng = locations.x;
      var locationsUrl = process.env.DARK_SKY_BASE_URL + lat + ',' + lng;
      
      request(locationsUrl, function (error, response, body) {
        if (error || response.statusCode != 200) {
          res.render('404')
        }
        else {
          var result = JSON.parse(body)
          res.render('result', {
            name: req.body.name,
            locationX: lat.toFixed(2),
            locationY: lng.toFixed(2),
            moment: moment,
            icons: icons,
            temp: result.currently.temperature.toFixed(0),
            data: result.daily.data
          });
        }
      })
    } 
  })
});



// Listen on PORT 9000
app.listen(9000, function(){
  console.log('I\'m listening to the smooth sounds of port 9000 in the morning. ☕');
});
