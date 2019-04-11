// require variables needed for modules
const DAYS_IN_FORECAST = 5;
var urlToCall;
var result;
var request = require('request');
require("dotenv").config();
var geocoder = require('simple-geocoder');
var moment = require('moment');

// Require node modules that you need
var express = require("express");
var layouts = require("express-ejs-layouts");
var parser = require("body-parser");

// Declare your app
var app = express();

// Tell express what view engine you want to use
app.set("view engine", "ejs");

// Include any middleware here
app.use(layouts);
app.use(express.static("static"));
app.use(parser.urlencoded({ extended: false }));

// Declare routes
app.get("/", (req, res) => {
  res.render("home");
});

app.post("/", (req, res) => {
  console.log(req.body.location);
  geocoder.geocode(req.body.location, (success, locations) => {
  	if(success) {
  		console.log("Location: ", locations.x, locations.y);
      urlToCall = process.env.DARK_SKY_BASE_URL + locations.y + ',' + locations.x;
      request(urlToCall, (error, response, body) => {
        if (error || response.statusCode !== 200) {
          console.log('error:', error); // Print the error if one occurred
          console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        }
        // console.log('body:', body); // Print the HTML for the page.
        result = JSON.parse(body);
        // console.log(result);
        // console.log(result.daily.data[0].time);
        // console.log(moment.unix(result.daily.data[0].time).format("dddd"));
        var days = [];
        var summary = [];
        var hTemp = [];
        var lTemp = [];
        var windSpeed = [];
        for (var i = 0; i < DAYS_IN_FORECAST; i++) {
          days.push(moment.unix(result.daily.data[i].time).format("dddd"));
          summary.push(result.daily.data[i].summary);
          hTemp.push(`High: ${Math.round(result.daily.data[i].temperatureHigh)}\u00b0F`);
          lTemp.push(`Low: ${Math.round(result.daily.data[i].temperatureLow)}\u00b0F`);
          windSpeed.push(`Wind: ${Math.round(result.daily.data[i].windSpeed)}mph`);
        }
        console.log(days);
        console.log(windSpeed);
        res.render("result", {
          searchLoc: req.body.location,
          longitude: locations.x,
          latitude: locations.y,
          temp: result.currently.temperature,
          daily: result.daily.data[0].summary,
          days: days,
          result: result,
          summary: summary,
          hTemp: hTemp,
          lTemp: lTemp,
          windS: windSpeed
        });
      });
  	}
  });
});
// High and Low Predicted Temperatures
// Description (the summary field)
// Wind speed, in MPH

// Listen on PORT 3002
app.listen(process.env.PORT || 3002, function(){
  console.log("listening on 3002");
});
