// Require node modules that you need
var express = require('express');
var layouts = require('express-ejs-layouts');
var parser = require('body-parser');
var geocoder = require('simple-geocoder');
//var urlToCall = process.env.DARK_SKY_BASE_URL + lat + ',' + lng;
var urlToCall;
var x_coord;
var y_coord;


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
			x_coord = locations.x;
			y_coord = locations.y;
			console.log("Location: ", locations.x, locations.y);
			//res.render('result', { x: x_coord, y: y_coord, query: req.body.userquery });
			res.render('result', { x: x_coord, y: y_coord });
			// console.log("also: ", x_coord, y_coord);
		} else { 
			res.send('error');
		};
		
	});
	
	
});

// Listen on PORT 3000
app.listen(3000, function(){
  console.log('I\'m listening to the smooth sounds of port 3000 in the morning. ☕');
});
