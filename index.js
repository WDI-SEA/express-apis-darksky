// Require node modules that you need
var express = require('express');
var layouts = require('express-ejs-layouts');
var parser = require('body-parser');
var geocoder = require('simple-geocoder')
var request = require('request')
require('dotenv').config()

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

app.post('/result', function(req, res){
  // see if we get the  Data from the form
  var local = req.body.city
  geocoder.geocode(req.body.city, function(success, locations) {
  	if(success) {
      console.log('location:', locations.y, locations.x)
      }
      var weather = process.env.DARK_SKY_BASE_URL + locations.y + ',' + locations.x;
      console.log(weather)
      request(weather, (error, response, body) => {
        var results = JSON.parse(body)
        console.log(results)
        res.render('result', {
          results: JSON.parse(body),
          local: local,
          locationsY: locations.y,
          locationsX: locations.x
        });
    });
      })
});

// Listen on PORT 3000
app.listen(3000, function(){
  console.log('I\'m listening to the smooth sounds of port 3000 in the morning. ☕');
});
