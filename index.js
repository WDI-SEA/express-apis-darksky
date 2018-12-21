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
				var result = JSON.parse(body);
				var currentTemp = result.currently.temperature;
				var highTemps = ['', '', '', '', ''];
				var lowTemps = ['', '', '', '', ''];
				var summaries = ['', '', '', '', ''];
				var windSpeeds = ['', '', '', '', ''];
				for (i=0; i<5; i++) {
					highTemps[i] = result.daily.data[i].temperatureHigh;
					lowTemps[i] = result.daily.data[i].temperatureLow;
					summaries[i] = result.daily.data[i].summary
					windSpeeds[i] = result.daily.data[i].windSpeed;
				};
				//console.log(jsonResults.data.children[0].data.url);
				console.log("current temp=", currentTemp);
				//console.log("highTempDay1=", highTempDay1)
				res.render('result', { x: x_coord, 
					y: y_coord, 
					query: req.body.userquery, 
					currentTemp: currentTemp,
					summaryDay0: summaries[0],
					highDay0: highTemps[0],
					lowDay0: lowTemps[0],
					windsDay0: windSpeeds[0],
					summaryDay1: summaries[1],
					highDay1: highTemps[1],
					lowDay1: lowTemps[1],
					windsDay1: windSpeeds[1],
					summaryDay2: summaries[2],
					highDay2: highTemps[2],
					lowDay2: lowTemps[2],
					windsDay2: windSpeeds[2],
					summaryDay3: summaries[3],
					highDay3: highTemps[3],
					lowDay3: lowTemps[3],
					windsDay3: windSpeeds[3],
					summaryDay4: summaries[4],
					highDay4: highTemps[4],
					lowDay4: lowTemps[4],
					windsDay4: windSpeeds[4]
			
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
