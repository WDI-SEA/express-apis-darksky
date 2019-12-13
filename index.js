// Require node modules that you need
let express = require('express');
let layouts = require('express-ejs-layouts');
let parser = require('body-parser');
let geocoder = require('simple-geocoder')

// Declare your app
let app = express();

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
  //geocode
  geocoder.geocode(req.body.location, function(success, locations) {
    if(success) {
      res.render('result', {myLocation: req.body.location, myCoordinates: locations})
    }
  });
});




// Listen on PORT 3000
app.listen(3000, function(){
  console.log('I\'m listening to the smooth sounds of port 3000 in the morning. ☕');
});
