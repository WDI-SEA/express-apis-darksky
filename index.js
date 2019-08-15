// Require node modules that you need
var express = require('express');
var layouts = require('express-ejs-layouts');
var parser = require('body-parser');
var geocoder = require('simple-geocoder');
var request = require('request');
require('dotenv').config();
var moment = require('moment');

// Declare your app
var app = express();

// Tell express what view engine you want to use
app.set('view engine', 'ejs');

// Include any middleware here
app.use(layouts);
app.use(express.static('static'));
app.use(parser.urlencoded({ extended: false }));

// Declare routes
app.get('/', function (req, res) {
  res.render('home');
});

app.post('/', function (req, res) {
  geocoder.geocode(req.body.name, function (success, locations) {
    if (success) {
      console.log("Location: ", locations.x, locations.y);
      var urlToCall = process.env.DARK_SKY_BASE_URL + locations.y + ',' + locations.x;
      console.log('asdfsdafasdf', urlToCall);
      request(urlToCall, (err, response, body) => {
        if (err || response.statusCode != 200) {
          console.log(err, ' ' , response)
          res.send('404')
        }
        else {
          // Parse the data 
          var result = JSON.parse(body);

          // Look at the data
          console.log(result);
          console.log('asdfasdfasdfasdf', moment(parseInt(result.daily.data[0].time+'000')))
          // TODO: Do something with that data!
          // for (var i = 0; i <= 4; i++){
          // var  d2 = [],
          //  d2= moment(parseInt(result.daily.data[i].time+'000'))
          // }
          res.render('result', { 
            name: req.body.name,
            x: locations.x,
            y: locations.y,
            r: result.currently.temperature,
            // d: result.daily.data[i].time,
            d1: moment(parseInt(result.daily.data[0].time+'000')),
            d2: result.daily.data[0].temperatureHigh,
            d3: result.daily.data[0].temperatureLow,
            d4: result.daily.data[0].summary,
            d5: result.daily.data[0].windSpeed,
            e1: moment(parseInt(result.daily.data[1].time+'000')),
            e2: result.daily.data[1].temperatureHigh,
            e3: result.daily.data[1].temperatureLow,
            e4: result.daily.data[1].summary,
            e5: result.daily.data[1].windSpeed,
            f1: moment(parseInt(result.daily.data[2].time+'000')),
            f2: result.daily.data[2].temperatureHigh,
            f3: result.daily.data[2].temperatureLow,
            f4: result.daily.data[2].summary,
            f5: result.daily.data[2].windSpeed,
            g1: moment(parseInt(result.daily.data[3].time+'000')),
            g2: result.daily.data[3].temperatureHigh,
            g3: result.daily.data[3].temperatureLow,
            g4: result.daily.data[3].summary,
            g5: result.daily.data[3].windSpeed,
            h1: moment(parseInt(result.daily.data[4].time+'000')),
            h2: result.daily.data[4].temperatureHigh,
            h3: result.daily.data[4].temperatureLow,
            h4: result.daily.data[4].summary,
            h5: result.daily.data[4].windSpeed,

          });
        
        }

      
      })


    }
  })
  // console.log(req.body);
});

// Listen on PORT 3000
app.listen(3000, function () {
  console.log('I\'m listening to the smooth sounds of port 3000 in the morning. ☕');
});
