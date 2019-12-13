// Require node modules that you need
// require(dotenv).config()
let express = require('express');
let layouts = require('express-ejs-layouts');
let parser = require('body-parser');
let geocoder = require('simple-geocoder');
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
  res.render('home') 
});

app.post('/results', function(req, res){
  let location = req.body.location
  geocoder.geocode(location, (success, locations) => {
    if(success) {
      console.log("Location: ", locations.x, locations.y)
      let coord = [locations.x.toFixed(2), locations.y.toFixed(2)]
      res.render('result', {myData: location, myCoord: coord});
      let lng = locations.x.toFixed(2)
      let lat = locations.y.toFixed()
      console.log(lat)
      console.log(lng)
      request('https://api.darksky.net/forecast/22e75dafa4c9846887b39a60718a76f8/'+lat+','+lng, (error, response, body) => {
        console.log('0')
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      // console.log('body:', body); // Print the HTML for the Google homepage.
      let result = JSON.parse(body)
      console.log(result)
    })
    }
  })
  console.log(req.body)
});

// Listen on PORT 3000
app.listen(3000, function(){
  console.log('I\'m listening to the smooth sounds of port 3000 in the morning. ☕');
});
