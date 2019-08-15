// Require node modules that you need
var express = require('express');
var layouts = require('express-ejs-layouts');
var parser = require('body-parser');
var geocoder = require('simple-geocoder')
var request = require('request')
var moment = require('moment')
var d2d = require('degrees-to-direction')
require('dotenv').config()

// Declare your app
var app = express();


// Tell express what view engine you want to use
app.set('view engine', 'ejs');

// Include any middleware here
app.use(layouts);
app.use(express.static('static'));
app.use(parser.urlencoded({ extended: false }));
app.locals.moment = moment;
app.locals.d2d = d2d

// Declare routes
app.get('/', function(req, res){
  res.render('home');
});

app.post('/', function(req, res){
    console.log(req.body)
    geocoder.geocode(req.body.location, function(success, locations) {
        let lat = locations.y.toFixed(6)
        let long = locations.x.toFixed(6)
        let requestUrl = process.env.DARK_SKY_BASE_URL + lat + ',' + long
        console.log("Request URL: " + requestUrl)
        if(success) {
            console.log("Location: ", lat, long);
            request(requestUrl, (err, response, body) => {
                if (err || response.statusCode != 200) {
                    console.log( err, response, body)
                    res.render('404')
                } else {
                    let locationInfo = JSON.parse(body)
                    console.log(locationInfo)
                    res.render('result', {
                        location: req.body.location, 
                        longitude: long, 
                        latitude: lat,
                        currently: locationInfo.currently,
                        currentDay: moment.unix(locationInfo.currently.time).format('ddd MMM Do'),
                        fiveDay: locationInfo.daily,
                    })
                }
            })
        }
        
    });
});

// Listen on PORT 3000
app.listen(3000, function(){
  console.log('I\'m listening to the smooth sounds of port 3000 in the morning. ☕');
});
