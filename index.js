// Require node modules that you need
var express = require('express');
var layouts = require('express-ejs-layouts');
var parser = require('body-parser');
var geocoder = require('simple-geocoder');
var request = require('request');


// Read the .env file
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
	geocoder.geocode(req.body.userquery, function(success, location) {
		if(success) {
			request(process.env.DARK_SKY_BASE_URL + location.y.toFixed(4) + ',' + location.x.toFixed(4), (err, response, body) => {
				console.log("Location: ", location);
				var latLong = JSON.parse(body);
				var result = JSON.parse(body).currently;
				var dailyWeather = JSON.parse(body).daily;
				Date.now();
				res.render('result', {weather: result, coordinates: latLong, query: req.body.userquery, summary: dailyWeather});
			})
		}
  	});
});

// Listen on PORT 3000
app.listen(3000, function(){
  console.log('I\'m listening to the smooth sounds of port 3000 in the morning. ☕');
});
