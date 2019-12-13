// Require node modules that you need
require('dotenv').config();
var express = require('express');
var layouts = require('express-ejs-layouts');
var parser = require('body-parser');
var geocoder = require('simple-geocoder');
var request = require('request');

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
  var location = req.body;

  geocoder.geocode(location.name, function(success, locations) {
    if(success) {
      location['coordinateLongitude'] = locations.x;
      location['coordinateLatitude'] = locations.y;

      var urlToCall = process.env.DARK_SKY_BASE_URL + '' + location.coordinateLatitude + ',' + location.coordinateLongitude;
      var temperatureInF = ''
      request(urlToCall, function(error, response, body) {

        // Parse the data 
        var result = JSON.parse(body);
    
        // Do something with that data!
        weatherInfo = result.currently

        res.render('result', {location, weatherInfo});
      });
    }
  });


});

// Listen on PORT 3000
app.listen(3000, function(){
  console.log('I\'m listening to the smooth sounds of port 3000 in the morning. ☕');
});
