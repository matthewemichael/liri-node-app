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
    (command === undefined && query === undefined) {
    var data = fs.readFileSync("./help.js");
    const script = new vm.Script(data);
    script.runInThisContext();
}

// search bandsintown
function concertThis(query) {
    axios.get("https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp")
    .then(function(response) {   
        
        for (var i = 0; i < 5; i++) { 
            var concertThisResults =
                "**********************************************************" +
                "\nLineup: " + response.data[i].lineup +
                "\nVenue: " + response.data[i].venue.name +
                "\nCity: " + response.data[i].venue.city +
                "\nDate: " + (moment(response.data[i].datetime).format("MM/DD/YYYY"))
            console.log(concertThisResults);
            
    }})
    .catch(function (error) {
        console.log(error);
    });
}

// search spotify
function spotifyThisSong(query) {
    spotify
    .search({ type: 'track', query: query })
    
    .then(function(response) {
        for (var i = 0; i < 5; i++) {
            var spotifyResults = 
                "**********************************************************" +
                "\nArtist: " + response.tracks.items[i].artists[0].name + 
                "\nSong Name: " + response.tracks.items[i].name +
                "\nAlbum Name: " + response.tracks.items[i].album.name +
                "\nPreview Link: " + response.tracks.items[i].preview_url;
            console.log(spotifyResults);
        }
    })
    .catch(function(error) {
        console.log(error);
    });
};
