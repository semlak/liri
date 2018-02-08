'use strict'


const baseURL = "https://www.omdbapi.com/"
const defaultMovieTitle = "Mr. Nobody"




let request = require("request");



function OMDB(data) {
	this.apikey = data.api_key;
	this.baseURL= baseURL;
	this.defaultMovieTitle = defaultMovieTitle;
}

OMDB.prototype.getKey = function() {
	return this.apikey;
}



OMDB.prototype.searchTitle = function(title, plot, loggerCallback) {
	// assumes input title has already been validated as a nonnull string
	// in title, replace any instances of multiple spaces with a single "+"
	// if no plot type is provided, assume short
	let urlSafeTitle = (title || this.defaultMovieTitle).trim().replace(/ +/, "+")
	let url = baseURL + "?t=" + urlSafeTitle
	+ "&y=&plot=" + (plot || "short") + "&apikey=" + this.apikey
	+ "&type=movie"
      request(url, function(error, response, body) {
      	if (error) {
      		loggerCallback("error:");
      		loggerCallback(error);
      	}
      	else if (response.statusCode !== 200) {
      		loggerCallback("OMDB Response status code: " + response.statusCode);
      	}
      	else {
	      	if (typeof loggerCallback === "function") {
	      		loggerCallback("Output for command: movie-this \"" + title + "\"");

	      		let result = JSON.parse(body);
	      		if (result.Error) {
	      			loggerCallback(result.Error);
	      		}
	      		else {
		      		loggerCallback(this.liriPrint(result));
	      		}
	      	}
      	}
      }.bind(this))
}


OMDB.prototype.liriPrint = function (movieData) {
	let requiredKeys = ["Title", "Year", "imdbRating", "Ratings", "Country", "Language", "Plot", "Actors"]
	if (!requiredKeys.every(key => movieData[key])) {
		return "Movie Data does not have all required keys."
	}
	let rottenData = movieData.Ratings ? movieData.Ratings.find(ratingData => ratingData.Source === "Rotten Tomatoes") : null;
	movieData.RottenRating = rottenData ? rottenData.Value : "Not provided"
	let keysToPrint = requiredKeys.map(key => key !== "Ratings" ? key : "RottenRating");
	let prettyKeyNames = {
		Title: "Title",
		Year: "Release Year",
		imdbRating: "IMDB Rating",
		RottenRating: "Rotten Tomatoes Rating",
		Country: movieData.Country.split(", ").length > 1 ? "Release Countries" : "Release Country",
		Language: "Language",
		Plot: "Plot",
		Actors: "Actors"
	}
	let output =  keysToPrint.map(key => prettyKeyNames[key] + ": " + movieData[key]).join("\n");
	return (output);

}

OMDB.prototype.liriTitle = function(queryData, loggerCallback) {
	if (typeof queryData === "string") {
		//assume input is title
		queryData = {title: queryData}
	}
	else if (typeof movieData === "null" || typeof movieData === "undefined" ) {
		queryData = {title : undefined}
	}

	if ("title" in queryData ) {
		this.searchTitle(queryData.title, "long", loggerCallback);
	}
}

module.exports = OMDB;
