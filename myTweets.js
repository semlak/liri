'use strict'

let Twitter = require("twitter");


function MyTweets(keys) {
	this.client = new Twitter(keys);
}

 MyTweets.prototype.getTweets = function(screen_name, callback) {
 	callback("setting params");
	var params = {
		screen_name: screen_name
	};
 	callback("running search")
 	callback( 'statuses/user_timeline')
 	callback(params);

	this.client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (error) {
			callback(error)
		}
		else {
			// callback("outputing tweets")
			callback("command: my-tweets " + params.screen_name)
			tweets.slice(0,20).forEach(tweet => this.liriPrint(tweet, callback));
			// console.log(tweets[0])
		}
	}.bind(this));

}

MyTweets.prototype.liriPrint = function(tweet, callback) {
	let output = tweet.text + " " + "\n" + tweet.created_at;
	callback(output);
}

module.exports = MyTweets;