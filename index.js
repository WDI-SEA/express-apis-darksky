// Require node modules that you need
var express = require('express');
var layouts = require('express-ejs-layouts');
var parser = require('body-parser');
var geocoder = require('simple-geocoder');

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
  var x;
  var y;
  var coordinates;

  geocoder.geocode(req.body.location, function(success, locations) {
  	if (success) {
  		console.log("location: ", locations.x, locations.y);
  		return locations;

  
  	}
  })
  console.log(x,y);

  location = req.body.location;

  res.render('result', {
  	where: location,
  	long: locations.x,
  	lat: locations.y
  });
  console.log(x,y);
  
});

// Listen on PORT 3000
app.listen(3000, function(){
  console.log('I\'m listening to the smooth sounds of port 3000 in the morning. ☕');
});
