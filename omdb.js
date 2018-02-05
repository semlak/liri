

const baseURL = "https://www.omdbapi.com/"
// let apikey = argv[2]
// console.log("apikey", apikey);
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



OMDB.prototype.searchTitle = function(title, plot, callback) {
	// assumes input title has already been validated as a nonnull string
	// in title, replace any instances of multiple spaces with a single "+"
	// if no plot type is provided, assume short
	let urlSafeTitle = (title || this.defaultMovieTitle).trim().replace(/ +/, "+")
	let url = baseURL + "?t=" + urlSafeTitle
	+ "&y=&plot=" + (plot || "short") + "&apikey=" + this.apikey
	+ "&type=movie"
	// console.log("url", url);
      request(url, function(error, response, body) {
      	if (error) {
      		callback("error");
      		callback(error);
      	}
      	else if (response.statusCode !== 200) {
      		callback("OMDB Response status code: " + response.statusCode);
      	}
      	else {
	      	// console.log("response", response);
	      	// console.log("body", body);
	      	if (typeof callback === "function") {
	      		callback("command: movie-this \"" + title + "\"");
	      		callback(this.liriPrint(JSON.parse(body)));
	      	}
      	}
      }.bind(this))
      // return url;
}


OMDB.prototype.liriPrint = function (movieData) {
	// console.log (movieData);
	// movieData.RottenRating = movieData.Ratings.filter(ratingData => ratingData.Source === "Rotten Tomatoes")[0].Value
	// console.log(movieData.Ratings);
	// console.log(movieData);
	let requiredKeys = ["Title", "Year", "imdbRating", "Ratings", "Country", "Language", "Plot", "Actors"]
	if (!requiredKeys.every(key => movieData[key])) {
		return "Movie Data does not have all required keys."
	}
	let rottenData = movieData.Ratings ? movieData.Ratings.find(ratingData => ratingData.Source === "Rotten Tomatoes") : null;
	movieData.RottenRating = rottenData ? rottenData.Value : "Not provided"
	// let keysToPrint = ["Title", "Year", "imdbRating", "RottenRating", "Country", "Language", "Plot", "Actors"]
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
	// keysToPrint.forEach(key => console.log("** " + prettyKeyNames[key] + ": " + movieData[key]));
	let output =  keysToPrint.map(key => prettyKeyNames[key] + ": " + movieData[key]).join("\n");
	// console.log("output", output);
	return (output);

}

OMDB.prototype.liriTitle = function(queryData, callback) {
	if (typeof queryData === "string") {
		//assume input is title
		queryData = {title: queryData}
	}
	else if (typeof movieData === "null" || typeof movieData === "undefined" ) {
		queryData = {title : undefined}
	}

	if ("title" in queryData ) {
		// let newCallback = (input) => callback(this.liriPrint(input));
		// let newCallback = (input) => this.liriPrint(input, callback);
		// this.searchTitle(queryData.title, "short", this.liriPrint);
		this.searchTitle(queryData.title, "long", callback);
	}
}

module.exports = OMDB;
