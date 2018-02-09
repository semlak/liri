'use strict'
require("dotenv").config();


let keys = require("./keys.js");
let OMDB = require("./omdb.js");
let MyTweets = require("./myTweets.js");
let MySpot = require("./mySpot.js");
let DoWhatItSays = require("./dowhatitsays.js");
const fs = require('fs');
const logfile = "log.txt"

let logger = function(data) {
	console.log("----------------------------")
	console.log(data);
	fs.appendFile(logfile, "----------------------------\n" + data + "\n", err=> err && console.log(err))
}


let omdb = new OMDB(keys.omdb)
let myspot = new MySpot(keys.spotify);
let mytweets = new MyTweets(keys.twitter);
let doWhatItSays = new DoWhatItSays();

let programArgs = process.argv.slice(2);

let defaultSearches = {
	"movie-this": "Mr. Nobody",
	"spotify-this-song": ["The Sign", "by", "Ace of Base"],
	"my-tweets": "CNN",
	"do-what-it-says": "./random.txt"
}


let liri = function(args) {
	logger("Running liri command: ")
	logger( args);
	switch(args[0]) {
		case "movie-this":
			omdb.liriTitle(args.slice(1).join(" ") || defaultSearches[args[0]], logger);
			break;
		case "spotify-this-song":
			myspot.spotifyThisSong(args.length > 1 ? args.slice(1) : defaultSearches[args[0]], logger);
			break;
		case "my-tweets":
			mytweets.getTweets(args[1] || defaultSearches[args[0]], logger);
			return;
		case "do-what-it-says":
			doWhatItSays.go(args[1] || defaultSearches[args[0]], liri, logger);
			break;
		default:
			logger("No valid program arguments detected.")
	}
}


liri(programArgs)
