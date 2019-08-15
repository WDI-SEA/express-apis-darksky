// Require node modules that you need
var express = require('express');
var layouts = require('express-ejs-layouts');
var parser = require('body-parser');
var request = require('request')
var geocoder = require('simple-geocoder')
var moment = require('moment')
require('dotenv').config()

// Declare your app
var app = express();

// Tell express what view engine you want to use
app.set('view engine', 'ejs');

// Include any middleware here
app.use(layouts);
app.use(express.static('static'));
app.use(parser.urlencoded({ extended: false }));

// Declare routes
app.get('/', function(req, res) {
    res.render('home');
});

app.post('/', function(req, res) {
    geocoder.geocode(req.body.text, (success, locations) => {
        if (success) {
            var urlToCall = process.env.DARK_SKY_BASE_URL + locations.y + ',' + locations.x
            console.log(urlToCall)
            request(urlToCall, (err, response, body) => {
                if (err || response.statusCode != 200) {
                    res.send('404')
                } else {
                    let result = JSON.parse(body)
                    var dailyArray = result.daily.data
                    var days = []
                    dailyArray.forEach(day => {
                        let obj = {
                            time: moment(parseInt(day.time + '000')).format('MMMM Do YYYY'),
                            lowTemp: day.temperatureLow,
                            highTemp: day.temperatureHigh,
                            summary: day.summary,
                            summaryIcon: checkSummary(day.icon),
                            windSpeed: day.windSpeed,
                            windSpeedIcon: checkWindSpeed(day.windSpeed)
                        }
                        days.push(obj)
                    })
                    res.render('result', { days: days })
                }
            })
        }
    })
});

// Listen on PORT 3000
app.listen(3000, function() {
    console.log('I\'m listening to the smooth sounds of port 3000 in the morning. ☕');
});


var checkSummary = (summary) => {
    var summaryIcon
    console.log(summary)
    if (summary === 'cloudy-day') {
        summaryIcon = 'wi-day-cloudy'
    } else if (summary === 'clear-day') {
        summaryIcon = 'wi-day-sunny'
    } else if (summary === 'partly-cloudy-day') {
        summaryIcon = 'wi-day-sunny-overcast'
    } else if (summary === 'rain') {
        summaryIcon = 'wi-day-rain'
    } else {
        summaryIcon = 'wi-day-sunny'
    }
    return summaryIcon
}

var checkWindSpeed = (windSpeed) => {
    if (windSpeed > 25) {
        windIcon = 'wi-strong-wind'
    } else {
        windIcon = 'wi-windy'
    }
    return windIcon
}