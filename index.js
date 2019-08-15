// Require node modules that you need
var express = require('express');
var layouts = require('express-ejs-layouts');
var parser = require('body-parser');
var geocoder = require('simple-geocoder');
var request = require('request');
var moment = require('moment');

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

app.post('/location', function(req, res){
 	geocoder.geocode(req.body.location, (success, locations) => {
		if (success) {
			request(process.env.DARK_SKY_BASE_URL + locations.y + "," + locations.x, function (error, response, body) {
				// console.log('error:', error); // Print the error if one occurred
				// console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
				//console.log('body:', body); // Print the HTML for the Google homepage.

				var data = JSON.parse(body);
				//console.log(data.daily.data[0]);
				var fiveDay = [];
				for (day of data.daily.data) {
					var obj = {};
					obj.day = moment(day.time*1000).format("dddd");
					obj.icon = getIcon(day.icon);
					obj.tempHigh = day.temperatureHigh.toFixed(0);
					obj.tempLow = day.temperatureLow.toFixed(0);
					fiveDay.push(obj);
				}

				res.render('result', {
					name: req.body.location,
					locations: locations,
			 		temperature: data.currently.temperature,
			 		summary: data.daily.summary,
			 		fiveday: fiveDay
			 	});
			});
		} 		
 	});
});

// Listen on PORT 3000
app.listen(3000, function(){
  console.log('I\'m listening to the smooth sounds of port 3000 in the morning. ☕');
});

function getIcon(iconStr) {
	switch (iconStr) {
		case "clear-day":
			return "\u2600";
			break;
		case "partly-cloudy-day":
		case "cloudy":
			return "\u2601";
			break;
		default:
			return iconStr;
			break;
	}
}