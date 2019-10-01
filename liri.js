require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

// moment package to format date
var moment = require("moment");
moment().format();

// get data from bandsintown and omdb
var axios = require("axios");

// vm allows you to run js files 
var vm = require("vm");
var fs = require("fs");

// fun package i found that lets you style text in terminal
// declared globally so i can style text in the help.js that runs when no user input is detected
global.colors = require('colors/safe');

// user command input
var command = process.argv[2]; 
// user search input
var query = process.argv[3];

// concatenate multiple word search input
for (var i = 4; i < process.argv.length; i++) {
    query += '+' + process.argv[i];
}

// run funtion based on command input
if (command === "concert-this") {
    concertThis(query);
} else if 
    (command === "spotify-this-song") {
    spotifyThisSong(query);
} else if
    (command === "movie-this") {
    movieThis(query);       
} else if 
    (command === "do-what-it-says") {
    doWhat()
} else if
    (command === undefined && query === undefined) {
    var data = fs.readFileSync("./help.js");
    const script = new vm.Script(data);
    script.runInThisContext();
}

// search bandsintown
function concertThis(query) {
    if(!query){
        query = "Wu-Tang";
    }
    axios.get("https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp")
    .then(function(response) {   
        for (var i = 0; i < 5; i++) { 
            var concertThisResults =
                "\nLineup: " + response.data[i].lineup +
                "\nVenue: " + response.data[i].venue.name +
                "\nCity: " + response.data[i].venue.city +
                "\nDate: " + (moment(response.data[i].datetime).format("MM/DD/YYYY")) + "\n" +
                "\n**********************************************************";
            console.log(concertThisResults);
            fs.appendFile("log.txt", concertThisResults, function(error) {
                if (error) {
                  return console.log(error);
                } 
            });
        }   
    })
    .catch(function (error) {
        console.log(error);
    });
}

// search spotify
function spotifyThisSong(query) {
    if(!query){
        query = "ace of base the sign";
    }
    spotify
    .search({ type: 'track', query: query })
    .then(function(response) {
        for (var i = 0; i < 5; i++) {
            var spotifyResults = 
                "\nArtist: " + response.tracks.items[i].artists[0].name + 
                "\nSong Name: " + response.tracks.items[i].name +
                "\nAlbum Name: " + response.tracks.items[i].album.name +
                "\nPreview Link: " + response.tracks.items[i].preview_url + "\n" +
                "\n**********************************************************";
            console.log(spotifyResults);
            fs.appendFile("log.txt", spotifyResults, function(error) {
                if (error) {
                  return console.log(error);
                } 
            });
        }
    })
    .catch(function(error) {
        console.log(error);
    });
};

// search omdb
function movieThis(query) {
    if(!query){
        query = "Mr. Nobody";
    }
    axios.get("https://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy")
    .then(function(response) {
        var movieResults = 
            "**********************************************************\n" +
            "\nMovie Title: " + response.data.Title + 
            "\nYear of Release: " + response.data.Year +
            "\nIMDB Rating: " + response.data.imdbRating +
            "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value +
            "\nCountry Produced: " + response.data.Country +
            "\nLanguage: " + response.data.Language +
            "\nPlot: " + response.data.Plot +
            "\nCast: " + response.data.Actors + "\n" +
            "\n**********************************************************";
        console.log(movieResults);
        fs.appendFile("log.txt", movieResults, function(error) {
            if (error) {
              return console.log(error);
            } 
        });
    })
    .catch(function (error) {
        console.log(error);
    });
}

// read random.txt and execute commands
function doWhat() {

    fs.readFile('random.txt', "utf8", function(error, data){

        if (error) {
           return console.log(error);
        }

        var dataArr = data.split(",");
       
        if (dataArr[0] === "spotify-this-song") {
            spotifyThisSong(dataArr[1]);
        } 
        if (dataArr[2] === "movie-this") {
            movieThis(dataArr[3]);
        }    
        if (dataArr[4] === "concert-this") {
            concertThis(dataArr[5]);
        }
    });   
};
   