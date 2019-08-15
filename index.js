// Require node modules that you need
let express = require('express');
let layouts = require('express-ejs-layouts');
let parser = require('body-parser');
let geocoder = require('simple-geocoder');
let restRequest = require('request');
require('dotenv').config()


// Declare your app
let app = express();

// Tell express what view engine you want to use
app.set('view engine', 'ejs');

// Include any middleware here
app.use(layouts);
app.use(express.static('static'));
app.use(parser.urlencoded({
  extended: false
}));

// Declare routes
app.get('/', function (req, res) {

  res.render('home');
});

app.post('/', function (req, res) {
  let location = req.body.location;

  geocoder.geocode(location, function (success, locations) {
    if (success) {
      // console.log("Location: ", locations.x, locations.y);
      let getRequest = process.env.DARK_SKY_BASE_URL + locations.y + ',' + locations.x;
      // console.log(`URL to Call is: ${getRequest}`);

      restRequest(getRequest, (err, response, body) => {
        if (err || response.statusCode != 200) {
          console.log(`An error occured in GET request to DarkSky`);
        }
        else {
          // console.log(JSON.parse(body));
          let data = JSON.parse(body);
          res.render('result', {
            location: location,
            x: locations.x,
            y: locations.y,
            currentTemperature: data.currently.temperature
          });
        }
      })


    }
  });

});

// Listen on PORT 3000
app.listen(3000, function () {
  console.log(`express is listening on port: 3000`);
});