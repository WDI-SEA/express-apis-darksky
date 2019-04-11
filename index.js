// Require node modules that you need
require('dotenv').config()
var moment = require('moment')
var express = require('express');
var layouts = require('express-ejs-layouts');
var parser = require('body-parser');
var geocoder = require('simple-geocoder')
var urlToCall = process.env.BASE_URL


// Declare your app
var app = express();

// Use moment in views
app.locals.moment = moment;

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

app.post('/results', function(req, res){
// Grab the geocode first
  geocoder.geocode(req.body.location, function(success, locations) {
	if(success) {
		//builds the correct URL 
  	  	var urlToCall = process.env.BASE_URL + locations.y + ',' + locations.x;
		// console.log(urlToCall)

		var request = require('request');
		request(urlToCall, (err, response, body)=> {
 			if(err || response.statusCode !=200){
  				//Print the response status code if a response was received
  			}else{
  				//cool, prob have some results
  				results = JSON.parse(body)

  				res.render('result', {
  					location: req.body.location,
  					results: results,
  					time: results.currently.time,
  					daily: results.daily.data
  				});
  			}
		});
	} else { console.log('failed')}
	});
});

// Listen on PORT 3000
app.listen(3000, function(){
  console.log('I\'m listening to the smooth sounds of port 3000 in the morning. ☕');
  // console.log(urlToCall)
});
