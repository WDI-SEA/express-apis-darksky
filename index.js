// Require node modules that you need
var express = require('express');
var layouts = require('express-ejs-layouts');
var parser = require('body-parser');
var geocoder = require('simple-geocoder');
var request = require('request');
var dotenv = require('dotenv').config();

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
	geocoder.geocode(req.body.userquery, function(success, locations) {
		if(success) {

			// res.render('result', { lat: locations.y, lng: locations.x, q: req.body.userquery }); 
			
			var urlToCall = process.env.DARK_SKY_BASE_URL + locations.y + ',' + locations.x;
			request(urlToCall, function(error, response, body) {
				if(error) {
					console.log('Error', error);
          			res.send('Error, check your logs');
				} else {
					// Parse the data 
					var result = JSON.parse(body);
					ctemperature = result.currently.temperature;
					chumidity = result.currently.humidity;
					cwindSpeed = result.currently.windSpeed;
					csummary = result.currently.summary;

					temperatureHigh = result.daily.data[0].temperatureHigh;
					temperatureLow = result.daily.data[0].temperatureLow;
					dhumidity = result.daily.data[0].humidity;
					dwindSpeed = result.daily.data[0].windSpeed;
					dsummary = result.daily.summary;
					// console.log(currentTemp);

					// Look at the data
					// console.log(result); 
					res.render('result2', { ctemperature: ctemperature, chumidity: chumidity, cwindSpeed: cwindSpeed, csummary: csummary, 
						temperatureHigh: temperatureHigh, temperatureLow: temperatureLow, dhumidity: dhumidity, dwindSpeed: dwindSpeed, dsummary: dsummary  });
					}
				});
		} else {
			res.send('Error, check your logs');
		}
	});
});

// UNDER CONSTRUCTION
// app.get('/current', function(req, res){
//   res.render('current');
// });

// Listen on PORT 3000
app.listen(3000, function(){
  console.log('I\'m listening to the smooth sounds of port 3000 in the morning. ☕');
});
