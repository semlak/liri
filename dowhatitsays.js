'use strict'

let fs = require("fs");

module.exports = class DoWhatItSays {


	prepareRequest(request, errorCallback) {
		try {
			// separate the liri command from the other arguments (split by commans) but preseve strings inside quotes:
			//https://stackoverflow.com/questions/23582276/split-string-by-comma-but-ignore-commas-inside-quotes?rq=1
			let commandAndArgs = request.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).filter(entry => entry.length > 0);
			let command = commandAndArgs[0];
			let arg = commandAndArgs.slice(1).join(" ");
			// // split args by " ", but preserve strings inside quotes, similar to above
			let args = arg.split(/ (?=(?:(?:[^"]*"){2})*[^"]*$)/).filter(entry => entry.length > 0);
			return [command].concat(args);
		}
		catch (err) {
			errorCallback(err)
		}

	}


	go(inputFile, liriCallback, loggerCallback) {
		fs.readFile(inputFile, "utf8", function(error, data) {
			// If the code experiences any errors it will log the error to the console.
			if (error) {
				loggerCallback(error);
			}
			else {
				//assume each non-blank line is a separate request, ignore lines beggining with # (a comment)
				let requests = data.split("\n").filter(line => line.trim().length > 0 && line.trim()[0] !== "#");
				if (requests.length < 1) {
					loggerCallback("No requests found in inputfile.")
				}
				else {
					// process each command. Make sure it is valid.
					let validCommands = ["spotify-this-song", "movie-this", "my-tweets"]
					requests.forEach(request => {
						let commandAndArgs = this.prepareRequest(request, loggerCallback);
						let command = commandAndArgs[0] || "error";
						if (validCommands.indexOf(command) > -1) {
							liriCallback(commandAndArgs);
						}
						else {
							loggerCallback("error with 'do-what-it-says' input ", request);
						}
					})
				}
			}
		}.bind(this));
	}

}


