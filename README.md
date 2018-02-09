# liri

LIRI is a Language Interpretation and Recognition Interface.

It provides simply querying of Twitter, Spotify, and OMDB.

The user can also store queries in a file and pass it to the program via command line.


#usage
to query tweets:
node liri.js my-tweets

or
node liri.js my-tweets TWITTER_USERNAME

The my-tweets command will retrieve CNN tweets by default.


to query movies via OMDB:
node liri.js movie-this
(default movie will be queried)
or
node liri.js movie-this MOVIENAME
movie name can be with or without quotes


to query music tracks via spotify
node liri.js spotify-this-song
or
node liri.js spotify-this-song SONGNAME

or
node liri.js spotify-this-song SONGNAME by ARTIST

note that if songname has the word "by" in it, it needs to be in quotation marks


to run the queries stored in a text file:
node liri.js do-what-it-says
will run default filename random.txt
or
node liri.js do-what-it-says INPUTFILENAME