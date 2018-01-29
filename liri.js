require("dotenv").config();


let keys = require("./keys.js");
let Spotify = require("node-spotify-api");
let Twitter = require("twitter");
let OMDB = require("./omdb.js");

let spotify = new Spotify(keys.spotify);
let twitter = new Twitter(keys.twitter);
let omdb = new OMDB(keys.omdb)

console.log("key: ", omdb.getKey())


let callback = function(body) {
	let data = JSON.parse(body);
	for (let key in data) {
		console.log ("*" + key + ":\t" + data[key]);
	}
}


omdb.searchTitle("Star Trek","short", callback);
// console.log(omdb.searchTitle(""));