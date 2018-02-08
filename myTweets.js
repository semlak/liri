'use strict'

let Twitter = require("twitter");


function MyTweets(keys) {
	this.client = new Twitter(keys);
}



MyTweets.prototype.liriPrint = function(tweet) {
	let keysToPrint = ["resultNum", "text", "created_at"]
	let prettyKeyNames = {
		resultNum: "Result Number",
		text : "Tweet Text",
		created_at: "Timestamp"
	}

	let output = keysToPrint.map(key =>prettyKeyNames[key] + ": " + tweet[key]).join("\n");

	return (output);
}

MyTweets.prototype.getTweets = function(screen_name, loggerCallback) {
	var params = {
		screen_name: screen_name
	};
	this.client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (error) {
			if (Array.isArray(error) && error.length > 0 && error[0].code == 34) {
				loggerCallback("That screen_name ('" + params.screen_name + "'') does not appear to exist (error code 34)." )
			}
			else if (Array.isArray(error) && error.length > 0 && error[0].message && error[0].code) {
				loggerCallback("Error: " + error[0].message + " (code " + error[0].code + ")")
			}
			else {
				loggerCallback(error);
			}
		}
		else {
			let numResults = tweets.length;
			loggerCallback("Results from command: my-tweets " + params.screen_name + "\nReturned " + numResults + (numResults === 1 ? " tweet." : " tweets.") )

			tweets.slice(0,20).forEach((tweet, i)=> {
				tweet.resultNum = i+1;
				loggerCallback(this.liriPrint(tweet));
			});
		}
	}.bind(this));

}


module.exports = MyTweets;