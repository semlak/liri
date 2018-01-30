'use strict'

require("dotenv").config();


let keys = require("./keys.js");
let Spotify = require("node-spotify-api");
let spotify = new Spotify(keys.spotify);



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
	let output = "";

	keysToPrint.forEach(key => output += ("** " + prettyKeyNames[key] + ": " + songData[key]) + "\n");
	return output;
}

MySpot.prototype.spotifyThisSong = function(args, callback) {
	// console.log("args", args)
	let trackQuery = args[0]
	let artistFilter = (args.length > 2 && args[1] === "by") ? args[2] : null;
	let limit = typeof artistFilter === "string" ? 20 : 1
	// return ;
	// spotify.search: function({ type: 'artist OR album OR track', query: 'My search query', limit: 20 }, callback);
	spotify.search({type: 'track', query: trackQuery})
		.then(function(response) {
			let data = response.tracks.items.slice(0, limit);
			data.forEach(function(item) {

				// console.log("item", JSON.stringify(item));
				// artist(s), song's name, preview link of the song, album
				// console.log("artists:", item.artists, JSON.stringify(item.artists))
				let track = item.name
				let artists = item.artists.map(artist=> artist.name).join(", ");
				let album = item.album.name;
				let link = item.preview_url;
				// console.log("artistFilter", artistFilter)
				// console.log (typeof artistFilter !== "string")
				// console.log(artistFilter === artists)
				// console.log(artists.match(artistFilter))

				if (typeof artistFilter !== "string" || artistFilter === artists || artists.match(artistFilter)) {
					let output = MySpot.prototype.liriPrint({
						track: track,
						artists: artists,
						album: album,
						link: link
					})
					callback(output);
				}
			})
	}).catch(function(err) {
		console.log("spotifyThis error: ", err);
	})

}


module.exports = MySpot