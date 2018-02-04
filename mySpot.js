'use strict'

require("dotenv").config();


let keys = require("./keys.js");
let Spotify = require("node-spotify-api");
let spot = new Spotify(keys.spotify);


function MySpot() {
	// console.log("data")
	// this.search = data.search;
}

MySpot.prototype.liriPrint = function (songData) {
	// console.log (movieData);
	let keysToPrint = ["track", "artists", "album", "link"]
	let prettyKeyNames = {
		track: "Song Name",
		artists: songData.artists.split(", ").length > 1 ? "Artists" : "Artist",
		album: "Album",
		link: "Preview Link"
	}
	return keysToPrint.map(key => "** " + prettyKeyNames[key] + ": " + songData[key]).join("\n");
}

MySpot.prototype.spotifyThisSong = function(args, callback) {
	// console.log("args", args)
	let indexToSplit = undefined;
	let trackQuery = undefined;
	let artistFilter = undefined;
	if (args.some(arg=> arg.toUpperCase() === "BY")) {
		indexToSplit = args.map(arg => arg.toUpperCase()).indexOf("BY");
		trackQuery = args.slice(0, indexToSplit).join(" ");
		artistFilter = args.slice(indexToSplit + 1).join(" ");
	}
	else {
		trackQuery = args.join(" ");
	}

	//let trackQuery = args[0]
	//let artistFilter = (args.length > 2 && args[1] === "by") ? args[2] : null;
	let limit = typeof artistFilter === "string" ? 20 : 1
	// return ;
	// console.log("trackQuery:", trackQuery, ", artistFilter:" , artistFilter , ", limit", limit)
	// spotify.search: function({ type: 'artist OR album OR track', query: 'My search query', limit: 20 }, callback);
	spot.search({type: 'track', query: trackQuery})
		.then(function(response) {
			let data = response.tracks.items.slice(0, limit);
			let item = null;
			if (typeof artistFilter === "string") {
				item = data.find(item => {
					// console.log("item.artists:", item.artists)
					let artists = item.artists.map(artist=> artist.name).join(", ");
					return artists.toUpperCase().match(artistFilter.toUpperCase());

				})
			}
			else {
				item = data[0];
			}

			let track = item.name
			let artists = item.artists.map(artist=> artist.name).join(", ");
			let album = item.album.name;
			let link = item.preview_url;

			let output = MySpot.prototype.liriPrint({
				track: track,
				artists: artists,
				album: album,
				link: link
			})
			callback(output);

	}).catch(function(err) {
		console.log("spotifyThis error: ", err);
	})

}


module.exports = MySpot