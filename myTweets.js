'use strict'

require("dotenv").config();


let keys = require("./keys.js");
let Twitter = require("twitter");
let client = new Twitter(keys.twitter);



var params = {screen_name: 'jsemlak88'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (error) {
  	console.log(error)
  }
  else {
    console.log(tweets);
  }
});

