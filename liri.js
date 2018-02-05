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

let logger = function(data, showOutput) {
	// console.log("data", data)
	if (showOutput) {
		console.log("----------------------------")
		console.log(data);
	}
	fs.appendFile(logfile, "----------------------------\n" + data + "\n", err=> err && console.log(err))

	// console.log("done logging data");
}

let callbackLogger = data => logger(data, true);

// callbackLogger = console.log
// logger = console.log

// let spotify = new Spotify(keys.spotify);
// let client = new Twitter(keys.twitter);
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
  		let [command, arg ] = request.split(",").map(entry => entry.trim());
  		// console.log("command", command, ", arg", arg);
  		// here, command is spotify-this-song and arguments have quotes around them, don't split, ottherwise, split
  		// this is to avoid accidently thinking a track with the word "by" occurring in it is referencing a tracy by artists
  		let songWithByInTrackRegex = /('|")(.*?by.*?)(\1)(.*)/i;
  		// let songWithArtistRegEx = /('|")(.*?by.*?)(\1)(.*)/i;
  		// let args = [];
  		let args = null;

  		if (command === "spotify-this-song" && arg && arg.match(songWithByInTrackRegex)) {
  			let matches = songWithByInTrackRegex.exec(arg);
  			let trackName = matches.length >= 2 ? matches[2].trim() : "error getting trackName from request" + request;
  			console.log("trackName", trackName);
  			let additionalSongInfo = (matches.length > 4 && matches[4].trim().length > 0) ? matches[4].trim().split(" ") : [];
  			args = [trackName].concat(additionalSongInfo);
  		}
  		else {
  			args = arg.split(" ");
  		}
  		return [command].concat(args);
  	}
  	catch (err) {
  		errorCallback(err)
  	}

}


let doWhatItSays = function(inputFile, callback) {
	fs.readFile(inputFile, "utf8", function(error, data) {

	  // If the code experiences any errors it will log the error to the console.
	  if (error) {
	    return console.log(error);
	  }
	  else {
	  	//assume each non-blank line is a separate request, ignore lines beggining with # (a comment)
	  	let requests = data.split("\n").filter(line => line.trim().length > 0 && line.trim()[0] !== "#");
	  	let validCommands = ["spotify-this-song", "movie-this", "my-tweets"]
	  	requests.forEach(request => {
	  		// let [command, arg ] = request.split(",").map(entry => entry.trim());
	  		// // console.log("command", command, ", arg", arg);
	  		// // here, command is spotify-this-song and arguments have quotes around them, don't split, ottherwise, split
	  		// // this is to avoid accidently thinking a track with the word "by" occurring in it is referencing a tracy by artists
	  		// let songWithByInTrackRegex = /('|")(.*?by.*?)(\1)(.*)/i;
	  		// // let songWithArtistRegEx = /('|")(.*?by.*?)(\1)(.*)/i;
	  		// // let args = [];
	  		// let args = null;

	  		// if (command === "spotify-this-song" && arg && arg.match(songWithByInTrackRegex)) {
	  		// 	let matches = songWithByInTrackRegex.exec(arg);
	  		// 	let trackName = matches.length >= 2 ? matches[2].trim() : "error getting trackName from request" + request;
	  		// 	let additionalSongInfo = (matches.length > 4 && matches[4].trim().length > 0) ? matches[4].trim().split(" ") : [];
	  		// 	args = [trackName].concat(additionalSongInfo);
	  		// }
	  		// else {
	  		// 	args = arg.split(" ");
	  		// }
	  		let commandAndArgs = prepareDoWhatItSaysRequest(request);
	  		let command = commandAndArgs[0] || "error";
	  		if (validCommands.indexOf(command) > -1 ) {
	  			console.log(commandAndArgs );
	  			liri(commandAndArgs);
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
	// logger(args, false);
	switch(args[0]) {
		case "movie-this":
			omdb.liriTitle(args.slice(1).join(" ") || defaultSearches[args[0]], callbackLogger);
			break;
		case "spotify-this-song":
			myspot.spotifyThisSong(args.length > 1 ? args.slice(1) : defaultSearches[args[0]], callbackLogger);
			break;
		case "my-tweets":
			mytweets.getTweets(args.length > 1 ? args[1] : defaultSearches[args[0]], callbackLogger);
		case "do-what-it-says":
			doWhatItSays(args[1] || defaultSearches[args[0]], callbackLogger);
			break;
		default:
			console.log("No valid program arguments detected.")
	}
}


liri(programArgs)
