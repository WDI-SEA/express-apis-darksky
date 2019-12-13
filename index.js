// Require node modules that you need
var express = require('express');
var layouts = require('express-ejs-layouts');
var parser = require('body-parser');
var geocoder = require('simple-geocoder');
let request = require('request')



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



app.post('/', (req, res) => {
  
  // console.log(req.body)
  var location = req.body.location;
  

  geocoder.geocode(location, (success, locations) => {
    if(success) {
      var lat = locations.y;
      var lng = locations.x;
      var urlToCall = process.env.DARK_SKY_BASE_URL + lat + ',' + lng;
      
      request(urlToCall, (error, response, body) => {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the page.
      });
      console.log(locations);
    }
  });

  res.render('result', { city: location });
});

// Listen on PORT 3000
app.listen(3000, function(){
  console.log('I\'m listening to the smooth sounds of port 3000 in the morning. ☕');
});

