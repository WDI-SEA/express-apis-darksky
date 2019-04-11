require('dotenv').config()

// Require node modules that you need
var express = require('express');
var layouts = require('express-ejs-layouts');
var geocoder = require('simple-geocoder');
var request = require('request')
var moment = require('moment')

// Declare your app
var app = express();

// Tell express what view engine you want to use
app.set('view engine', 'ejs');

// Include any middleware here
app.use(layouts);
app.use(express.static('static'));
app.use(express.urlencoded({ extended: false }));

// Declare routes
app.get('/', (req, res) => {
  res.render('home');
});

app.post('/', (req, res) => {
	var location = req.body.location
	geocoder.geocode(location, (success, l) => {
		var longitude = l.x
		var latitude = l.y
		var url = process.env.BASE_URL + l.y + "," + l.x
		if(success) {
			request(url, (error, response, body) => {
			if (error || response.statusCode != 200) {
				// Sum Ting Wong
				console.log('error: ', error)
				console.log('status code: ', response.statusCode)
				res.send('ahh shit')
			} else {
				var results = JSON.parse(body)
				var days = []
				results.daily.data.forEach((t) => {
					var day = moment.unix(t.time).format('dddd')
					days.push(day)
				})
				res.render('result', { 
					location: location, 
					results: results, 
					days: days,
					longitude: longitude, 
					latitude: latitude })
			}
		})
		}
	})
});

// Listen on PORT 3000
app.listen(3000, () => {
  console.log('we good ☕');
});
