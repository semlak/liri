'use strict'
require("dotenv").config();


let keys = require("./keys.js");
// let Spotify = require("node-spotify-api");
let Twitter = require("twitter");
let OMDB = require("./omdb.js");
let ReadFromFile = require("./readFromFile.js")
let MySpot = require("./mySpot.js");
const fs = require('fs');
const logfile = "log.txt"

fs.appendFile("xena.txt", "xena is cuddly", (err) => console.log(err))
let log = function(data) {
	console.log(data)
	fs.appendFile(logfile, data)
}

log ("xena is cuddly")

// let spotify = new Spotify(keys.spotify);
let twitter = new Twitter(keys.twitter);
let omdb = new OMDB(keys.omdb)
let myspot = new MySpot();
// let doWhatItSays = new

let programArgs = process.argv.slice(2);

let defaultSearches = {
	"movie-this": "Mr. Nobody",
	"spotify-this": ["The Sign", "by", "Ace of Base"]
}


switch(programArgs[0]) {
	case "movie-this":
		omdb.liriTitle(programArgs[1] || defaultSearches["movie-this"], log);
		break;
	case "spotify-this":
		myspot.spotifyThisSong(programArgs.length > 1 ? programArgs.slice(1) : defaultSearches["spotify-this"], log);
		break;
	default:
		console.log("No valid program arguments detected.")
}


let callback = function(body) {
	let data = body;
	for (let key in data) {
		console.log ("*" + key + ":\t" + (JSON.stringify(data[key])));
	}
}

// callback = omdb.liriPrint;

// omdb.searchTitle("Star Trek","short", callback);
// omdb.liriTitle("Star Trek");
// console.log(omdb.searchTitle(""));