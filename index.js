// Require node modules that you need
var express = require('express');
var layouts = require('express-ejs-layouts');
var parser = require('body-parser');
var geocoder = require('simple-geocoder');
var request = require('request');

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
	geocoder.geocode(req.body.cityName, function(success, locations) {
		if(req.body.cityName === ''){
			res.render('home');
		}
		else if(success) {
			var urlToCall = process.env.DARK_SKY_BASE_URL + process.env.DARKSKY_API_KEY + locations.y.toFixed(4) + ',' + locations.x.toFixed(4);
			request(urlToCall, function(error, response, body) {
			    // Parse the data 
			    var i = 0;
			    var result = JSON.parse(body).currently;
			    var latLong = JSON.parse(body);
			    var fiveDay = JSON.parse(body).daily.data;

			    // Look at the data
			    console.log(fiveDay[i].time); 

			    // TODO: Do something with that data!
			   	res.render('result', { results: result, coordinates: latLong, query: req.body.cityName, forecast: fiveDay });
			});
		}
	});
});

// Listen on PORT 8000
app.listen(8000, function(){
  console.log('I\'m listening to the smooth sounds of port 8000 in the morning. ☕');
});
