

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
	let url = baseURL + "?t=" + (title || this.defaultMovieTitle).trim().replace(/ +/, "+")
	+ "&y=&plot=" + (plot || "short") + "&apikey=" + this.apikey
	+ "&type=movie"
      // url: "https://www.omdbapi.com/?t=romancing+the+stone&y=&plot=short&apikey=trilogy",
      request(url, function(error, response, body) {
      	if (error) {
      		console.log("error", error);
      	}
      	else {
	      	// console.log("response", response);
	      	// console.log("body", body);
	      	if (typeof callback === "function") {
	      		callback(JSON.parse(body));
	      	}
      	}
      })
      // return url;
}


OMDB.prototype.liriPrint = function (movieData) {
	// console.log (movieData);
	movieData.RottenRating = movieData.Ratings.filter(ratingData => ratingData.Source === "Rotten Tomatoes")[0].Value
	let keysToPrint = ["Title", "Year", "imdbRating", "RottenRating", "Country", "Language", "Plot", "Actors"]
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
	keysToPrint.forEach(key => console.log("** " + prettyKeyNames[key] + ": " + movieData[key]));
}

OMDB.prototype.liriTitle = function(queryData) {
	if (typeof queryData === "string") {
		//assume input is title
		queryData = {title: queryData}
	}
	else if (typeof movieData === "null" || typeof movieData === "undefined" ) {
		queryData = {title : undefined}
	}

	if ("title" in queryData ) {
		this.searchTitle(queryData.title, "short", this.liriPrint);
	}
}

module.exports = OMDB;
