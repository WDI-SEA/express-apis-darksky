// Require node modules that you need
const express = require('express');
const layouts = require('express-ejs-layouts');
const parser = require('body-parser');
const request = require('request');
const geocoder = require('simple-geocoder');
const moment = require('moment');
require('dotenv').config();
// Declare your app
const app = express();

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

app.get('/result', function(req, res){
  res.render('result');
})

app.post('/result', function(req, res){
  geocoder.geocode(req.body.name, function(success, locations) {
    if(success) {

      let urlToCall = process.env.DARK_SKY_BASE_URL + locations.y + ',' + locations.x;
      //console.log(urlToCall);
      request(urlToCall, (err, response, body) => {
        if(err || response.statusCode != 200){
          res.send('404');
        } else {
        let result = JSON.parse(body);
        let dailyArr = [];
        for (i = 0; i < 5; i++){
          dailyArr.push(result.daily.data[i]);
        }
        res.render('result', {

          name: req.body.name,
          summary: result.daily.summary,
          days: dailyArr
          
        })
        }
      })
    
    }
  })
});

// Listen on PORT 3000
app.listen(3000, function(){
  console.log('I\'m listening to the smooth sounds of port 3000 in the morning. ☕');
});
