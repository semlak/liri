'use strict'
require("dotenv").config();


let keys = require("./keys.js");
// let Spotify = require("node-spotify-api");
// let Twitter = require("twitter");
let OMDB = require("./omdb.js");
// let ReadFromFile = require("./readFromFile.js")
let MyTweets = require("./myTweets.js");
let MySpot = require("./mySpot.js");
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
let programArgs = process.argv.slice(2);


let defaultSearches = {
	"movie-this": "Mr. Nobody",
	"spotify-this-song": ["The Sign", "by", "Ace of Base"],
	"my-tweets": "CNN",
	"do-what-it-says": "./random.txt"
}

let prepareDoWhatItSaysRequest = function(request, errorCallback) {
	try {
		// separate the liri command from the other arguments (split by commans) but preseve strings inside quotes:
		//https://stackoverflow.com/questions/23582276/split-string-by-comma-but-ignore-commas-inside-quotes?rq=1
  		let commandAndArgs = request.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).filter(entry=> entry.length > 0);
  		let command = commandAndArgs[0];
  		let arg = commandAndArgs.slice(1).join(" ");
  		// // split args by " ", but preserve strings inside quotes, similar to above
  		let args = arg.split(/ (?=(?:(?:[^"]*"){2})*[^"]*$)/).filter(entry=> entry.length > 0);
  		return [command].concat(args);
  	}
  	catch (err) {
  		errorCallback(err)
  	}

}


let doWhatItSays = function(inputFile, loggerCallback) {
	fs.readFile(inputFile, "utf8", function(error, data) {

	  // If the code experiences any errors it will log the error to the console.
	  if (error) {
	    loggerCallback (error);
	  }
	  else {
	  	//assume each non-blank line is a separate request, ignore lines beggining with # (a comment)
	  	let requests = data.split("\n").filter(line => line.trim().length > 0 && line.trim()[0] !== "#");
	  	if (requests.length < 1) {
	  		loggerCallback("No requests found in inputfile.")
	  	}
	  	else {
	  		// process each command. Make sure it is valid.
		  	let validCommands = ["spotify-this-song", "movie-this", "my-tweets"]
		  	requests.forEach(request => {
		  		let commandAndArgs = prepareDoWhatItSaysRequest(request, loggerCallback);
		  		let command = commandAndArgs[0] || "error";
		  		if (validCommands.indexOf(command) > -1 ) {
		  			liri(commandAndArgs);
		  		}
		  		else {
		  			loggerCallback("error with 'do-what-it-says' input ", request);
		  		}
		  	})
	  	}
	  }
	});
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
			doWhatItSays(args[1] || defaultSearches[args[0]], logger);
			break;
		default:
			logger("No valid program arguments detected.")
	}
}


liri(programArgs)
