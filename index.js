// Require node modules that you need
var express = require('express');
var layouts = require('express-ejs-layouts');
var parser = require('body-parser');
var geocoder = require('simple-geocoder');
var urlToCall = process.env.DARK_SKY_BASE_URL + lat + ',' + lng;

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
    request('https://api.darksky.net/forecast/' + urlToCall, function (error, response, body) {
        console.log('0')
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        res.send(body)
        var result = JSON.parse(body);
        console.log(result);
    })
});

app.post('/results', function(req, res){
  let location = req.body.location
  res.render('result', { myData: location });
  console.log(req.body);
  geocoder.geocode(req.body.location, function(success, locations) {
    if(success) {
      console.log("Location: ", locations.x, locations.y);
    }
  });
});

// Listen on PORT 3000
app.listen(3000, function(){
  console.log('I\'m listening to the smooth sounds of port 3000 in the morning. ☕');
});
