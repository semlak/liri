'use strict'


let Spotify = require("node-spotify-api");

function MySpot(keys) {
	this.client = new Spotify(keys);
}

MySpot.prototype.liriPrint = function (songData, callback) {
	let keysToPrint = ["resultNum", "track", "artists", "album", "link"]
	if (!keysToPrint.every(key => songData[key])) {
		return "Song Data does not have all required keys."
	}
	let prettyKeyNames = {
		resultNum: "Result Number",
		track: "Song Name",
		artists: songData.artists.split(", ").length > 1 ? "Artists" : "Artist",
		album: "Album",
		link: "Preview Link"
	}
	let output = keysToPrint.map(key =>prettyKeyNames[key] + ": " + songData[key]).join("\n");
	callback(output);
}

MySpot.prototype.spotifyThisSong = function(args, callback) {
	let indexToSplit = undefined;
	let trackQuery = undefined;
	let artistFilter = undefined;
	console.log(args);
	// if (args.length === 1 && args[0][0] !== "\"" && args[0][0] !== "\'") {
	// 	console.log(args[0][0])
	// 	args = args[0].split(" ");
	// }
	// check to see if user entered a song and artist (TRACKNAME by ARTIST)
	// however, encase the word by occurs in the track name, the user will have had to put track name in quotes.

	if (args.some(arg=> arg.toUpperCase() === "BY")) {
		indexToSplit = args.map(arg => arg.toUpperCase()).indexOf("BY");
		trackQuery = args.slice(0, indexToSplit).join(" ");
		artistFilter = args.slice(indexToSplit + 1).join(" ");
	}
	else {
		trackQuery = args.join("+");
	}

	let limit = 20;
	console.log("trackQuery:", trackQuery);
	this.client.search({type: 'track', query: trackQuery})
		.then(function(response) {
			// let data = response.tracks.items.slice(0, limit+1);
			let data = response.tracks.items;
			if (typeof artistFilter === "string") {
				data = data.filter(item => {
					// console.log("item.artists:", item.artists)
					let artists = item.artists.map(artist=> artist.name).join(", ");
					return artists.toUpperCase().match(artistFilter.toUpperCase());
				})
			}
			let originalArgs = (args[0].match(/ /) && !args[0].match(/['"]/) ? "\"" + args[0] + "\"" : args[0]) +
				 (args.length > 1 ? " " + args.slice(1).join(" ") : "");
			// callback("command: spotify-this-song " + originalArgs);
			callback("command: spotify-this-song \"" + trackQuery.replace(/["']/g, "") +"\"" + (artistFilter ? " by \"" + artistFilter + "\"": ""));
			data.forEach(function(item, i) {
				let songData = {
					resultNum: i + 1,
					track: item.name,
					artists: item.artists.map(artist=> artist.name).join(", "),
					album: item.album.name,
					link: item.preview_url
				}
				this.liriPrint(songData, callback)

			}.bind(this))

	}.bind(this)).catch(function(err) {
		callback("spotifyThis error: ");
		callback(err);
	})

}


module.exports = MySpot