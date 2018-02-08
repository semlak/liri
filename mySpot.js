'use strict'


let Spotify = require("node-spotify-api");

function MySpot(keys) {
	this.client = new Spotify(keys);
}

MySpot.prototype.liriPrint = function (songData) {
	let keysToPrint = ["resultNum", "track", "artists", "album", "link"]
	// if (!keysToPrint.every(key => songData[key])) {
	// 	return "Song Data does not have all required keys."
	// }
	let prettyKeyNames = {
		resultNum: "Result Number",
		track: "Song Name",
		artists: songData.artists.split(", ").length > 1 ? "Artists" : "Artist",
		album: "Album",
		link: "Preview Link"
	}
	let output = keysToPrint.map(key =>prettyKeyNames[key] + ": " + songData[key]).join("\n");
	return (output);
}

MySpot.prototype.spotifyThisSong = function(args, loggerCallback) {
	let indexToSplit = undefined;
	let trackQuery = undefined;
	let artistFilter = undefined;
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
	debugger;
	this.client.search({type: 'track', query: trackQuery})
		.then(function(response) {
			let data = response.tracks.items;
			if (typeof artistFilter === "string") {
				data = data.filter(item => {
					let artists = item.artists.map(artist=> artist.name).join(", ");
					return artists.toUpperCase().match(artistFilter.toUpperCase());
				})
			}
			let originalArgs = trackQuery.replace(/["']/g, "") +"\"" + (artistFilter ? " by \"" + artistFilter + "\"": "");
			loggerCallback("Results from command: spotify-this-song \"" + originalArgs);
			data.forEach(function(item, i) {
				let songData = {
					resultNum: i + 1,
					track: item.name,
					artists: item.artists.map(artist=> artist.name).join(", "),
					album: item.album.name,
					link: item.preview_url || "Preview Link not currently available"
				}
				loggerCallback(this.liriPrint(songData));

			}.bind(this))

	}.bind(this)).catch(function(err) {
		loggerCallback("spotifyThis error for track '" + trackQuery + "': ");
		loggerCallback(err.message ? err.message : "Error retrieving spotify data");
	})

}


module.exports = MySpot