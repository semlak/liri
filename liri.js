'use strict'
require("dotenv").config();


let keys = require("./keys.js");
// let Spotify = require("node-spotify-api");
let Twitter = require("twitter");
let OMDB = require("./omdb.js");
// let ReadFromFile = require("./readFromFile.js")
let MySpot = require("./mySpot.js");
const fs = require('fs');
const logfile = "log.txt"

let logger = function(data, showOutput) {
	if (showOutput) {
		console.log(data);
	}
	fs.appendFile(logfile, data + "\n", err=> err && console.log(err))
}

let callbackLogger = data => logger(data, true);

// callbackLogger = console.log
// logger = console.log

// let spotify = new Spotify(keys.spotify);
let client = new Twitter(keys.twitter);
let omdb = new OMDB(keys.omdb)
let myspot = new MySpot();

let programArgs = process.argv.slice(2);


let defaultSearches = {
	"movie-this": "Mr. Nobody",
	"spotify-this-song": ["The Sign", "by", "Ace of Base"],
	"do-what-it-says": "./random.txt"
}

let doWhatItSays = function(inputFile, callback) {
	fs.readFile(inputFile, "utf8", function(error, data) {

	  // If the code experiences any errors it will log the error to the console.
	  if (error) {
	    return console.log(error);
	  }
	  else {
	  	let requests = data.split("\n");
	  	let validCommands = ["spotify-this-song", "movie-this", "my-tweets"]
	  	requests.forEach(request => {
	  		let [command, arg ] = request.split(",").map(entry => entry.trim());
	  		// console.log("command", command, ", arg", arg);
	  		if (validCommands.indexOf(command) > -1 ) {
	  			liri([command, arg]);
	  		}
	  		else {
	  			callback("error with 'do-what-it-says' input ", request);
	  		}
	  	})
	  }
	});
}


let callback = function(body) {
	let data = body;
	for (let key in data) {
		console.log ("*" + key + ":\t" + (JSON.stringify(data[key])));
	}
}

let liri = function(args) {
	logger(args, false);
	switch(args[0]) {
		case "movie-this":
			omdb.liriTitle(args[1] || defaultSearches[args[0]], callbackLogger);
			break;
		case "spotify-this-song":
			myspot.spotifyThisSong(args.length > 1 ? args.slice(1) : defaultSearches[args[0]], callbackLogger);
			break;
		case "do-what-it-says":
			doWhatItSays(args[1] || defaultSearches[args[0]], callbackLogger);
			break;
		default:
			console.log("No valid program arguments detected.")
	}
}


liri(programArgs)
