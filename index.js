// Require node modules that you need
require('dotenv').config()
var express = require('express');
var layouts = require('express-ejs-layouts');
var parser = require('body-parser');
let request = require('request');
var geocoder = require('simple-geocoder');

//47.608013,-122.335167
// Declare your app
var app = express();

// Tell express what view engine you want to use
app.set('view engine', 'ejs');

// Include any middleware here
app.use(layouts);
app.use('/', express.static('static'));
app.use(parser.urlencoded({ extended: false }));

// Declare routes
app.get('/', function(req, res){
  res.render('home');
});


  // request('https://api.darksky.net/forecast/' + process.env.DARK_SKY_API_KEY + '47.608013' + ',' + '-122.335167',  (error, response, body) => {





app.post('/result', function(req, res){
  let location = req.body.location
  geocoder.geocode(location, (success, locations) => {
    if(success) {
      let coord = [locations.x.toFixed(2), locations.y.toFixed(2)]
      let lng = locations.x.toFixed(4)
      let lat = locations.y.toFixed(4)
      request('https://api.darksky.net/forecast/'+process.env.DARKSKY_API_KEY+'/'+lat+','+lng, (error, response, body) => {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      // console.log('body:', body);
      var info = JSON.parse(body)
      var temp = info.currently.temperature
      res.render('result', {myData: location, myCoord: coord, temperature: temp});
    })
    }
  })
  console.log(req.body)
});


// Listen on PORT 3000
app.listen(3000, function(){
  console.log('I\'m listening to the smooth sounds of port 3000 in the morning. ☕');
});
