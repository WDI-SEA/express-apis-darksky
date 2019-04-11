require('dotenv').config()
// Require node modules that you need
var geocoder = require('simple-geocoder')
var express = require('express');
var layouts = require('express-ejs-layouts');
var parser = require('body-parser');
var request = require('request')
var moment = require('moment')


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

app.post('/', function(req, res){
  var urlToCall = process.env.DARK_SKY_BASE_URL
  var locationx
  var locationy
  var temp
  var todaySum
  var daily
  var days = []

  geocoder.geocode(req.body.location, function(success, locations) {
	if(success) {
     locationx = locations.y
		 locationy = locations.x
     urlToCall = urlToCall + locationx + ','+ locationy

     request(urlToCall, function(error, response, body) {
       // Parse the data
       var result = JSON.parse(body);

       // Look at the data

       // TODO: Do something with that data!
       temp = result.currently.temperature
       todaySum = result.currently.summary
       daily = result.daily.data
       daily.forEach((day)=>{
         days.push(moment.unix(day.time).format('dddd'))
       })

       for (var i = 0; i < daily.length; i++) {
         daily[i].date = days[i]
       }


       res.render('result',{
         daily:daily,
         todaySum:todaySum,
         temp : temp,
         city:req.body.location,
         locationx: locationx.toFixed(6),
         locationy: locationy.toFixed(6)
       });

   });
	}else{
    console.log("something went wrong");
  }



});


});

// Listen on PORT 3000
app.listen(3000, function(){
  console.log('I\'m listening to the smooth sounds of port 3000 in the morning. ☕');
});
