// Require node modules that you need
const express = require('express');
const layouts = require('express-ejs-layouts');
const parser = require('body-parser');
const geocoder = require('simple-geocoder');
const request = require('request');
const async = require("async");
require('dotenv').config();

// Declare your app
const app = express();

// Tell express what view engine you want to use
app.set('view engine', 'ejs');

// Include any middleware here
app.use(layouts);
app.use(express.static('static'));
app.use(parser.urlencoded({ extended: false }));

// ROUTES //

app.get('/', (req, res) => {
  res.render('home');
});

// Renders results page
app.post('/', getWeatherData);


// Listen on PORT 3000
app.listen(3000, function(){
  console.log('I\'m listening to the smooth sounds of port 3000 in the morning. ☕');
});


// Takes a string and gets weather data from that location
// getWeatherData :: req, res -> ()
function getWeatherData(req, res) {
  const lat_long = { lat: 0, long: 0 };
  let urlToCall;

  async.series([
    // Get lat,long from geocode
    callback => {
      console.log('Start geolocate');
      geocoder.geocode(`${req.body.userquery}`, function (success, locations) {
        if (success) {
          lat_long.lat = locations.y.toFixed(4);
          lat_long.long = locations.x.toFixed(4);
          urlToCall = process.env.DARK_SKY_BASE_URL + lat_long.lat + ',' + lat_long.long;
          callback(null);
        } else {
          callback({error: `Geocoder can't find location`, message: `We couldn't find that location, Please try again.`});
        }

      })
    },

    // Find nicely formatted string if it takes less than 2 seconds
    callback => {
      const timeoutLookup = async.timeout(getLocationString, 2000);
      console.log('Start timeout');
      timeoutLookup(lat_long, (err, data) => {
        if (err) {
          // If an issue or timeout then just print the user's query
          callback(null, `"${req.body.userquery}"`);
        } else {
          callback(null, data);
        }
      });
    },

    // Get weather data from DarkSky
    callback => {
      request(urlToCall, (error, response, body) => {
        if (error) {
          callback({error: error, message: 'We are having trouble gathering the needed data, Please try again.'});
        }
        const data = JSON.parse(body);
        // Probably failed if not in 200's
        if (data.code > 204) {
          callback({error: data.code, message: 'We are having trouble gathering the needed data, Please try again.'});
        }
        callback(null, data);
      });
    }
  ],

  // After we have the data. Render the page
  (err, results) => {
    if (err) {
      console.log(err.error)
      // Need to add a try again message
      res.redirect('/');
    } else {
      const data = results.pop();
      data.locationString = results.pop();
      res.render('result', { query: req.body.userquery, data: data });
    }
  });

}


// Reverse geocoder to get nice string of location
// getLocationString {}, f(err, data) => f(err, data)
function getLocationString (lat_long, callback) {
  // Get nicely formatted string for location
  geocoder.reverse(`${lat_long.lat},${lat_long.long}`, function (success, result) {
    if (success) {
      console.log("Location: ", result.Address, result.City, result.Region, result.Postal, result.CountryCode);
      if(result.City) {
        return callback(null, `${result.City}, ${result.Region}, ${result.CountryCode}`);
      } else {
        return callback(null, `${result.Region}, ${result.CountryCode}`);
      }
    } else {
      return callback(null, `"${req.body.userquery}"`);
    }
  });
}

