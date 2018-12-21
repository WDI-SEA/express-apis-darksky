// Require node modules that you need
var express = require('express');
var layouts = require('express-ejs-layouts');
var parser = require('body-parser');
var geocoder = require('simple-geocoder');
var request = require('request');

//var urlToCall = process.env.DARK_SKY_BASE_URL + lat + ',' + lng;
var urlToCall;
var x_coord;
var y_coord;

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
// app.use(geocoder.geocoder);

// Declare routes
app.get('/', function(req, res){
  res.render('home');
});

app.post('/', function(req, res){
	// res.render('result');
	// console.log(req.body);
	geocoder.geocode(req.body.userquery, function(success, locations) {
		if(success) {
			x_coord = JSON.stringify(locations.x);
			y_coord = JSON.stringify(locations.y);
			console.log("Location: ", locations.x, locations.y);
			urlToCall = process.env.DARK_SKY_API_BASE_URL + y_coord + ',' + x_coord;
			console.log("urlToCall=", urlToCall);

			request(urlToCall, function (error, response, body) {
				// console.log('error:', error); // Print the error if one occurred
				// console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
				// console.log('body:', body); // Print the HTML for the weather page?
				var result = JSON.parse(body);
				var currentTemp = result.currently.temperature;
				// var highTempDay1 = result.currently.daily.data.[0].temperatureHigh;
				// var lowTempDay1 = result.currently.daily.data.[0].temperatureLow;


				//console.log(jsonResults.data.children[0].data.url);
				console.log("current temp=", result.currently.temperature);
				res.render('result', { x: x_coord, 
					y: y_coord, 
					query: req.body.userquery, 
					temp: currentTemp
					// ,
					// highTempDay1: highTempDay1,
					// lowTempDay1: lowTempDay1
					 });
			});

		} else { 
			res.send('error');
		};
		
	});
	
	
});

// Listen on PORT 3000
app.listen(3000, function(){
  console.log('I\'m listening to the smooth sounds of port 3000 in the morning. ☕');
});
