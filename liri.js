require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var moment = require("moment");
moment().format();

var axios = require("axios");

var fs = require("fs");

var command = process.argv[2]; 
var query = process.argv[3];

if (command === "concert-this") {
    concertThis(query);
} else if 
    (command === "spotify-this-song") {
    spotifyThisSong(query);
}

function concertThis(query) {
    axios.get("https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp")
    .then(function(response) {   
        for (var i = 0; i < 5; i++) { 
            var concertThisResults =
                "\nVenue: " + response.data[i].venue.name +
                "\nCity: " + response.data[i].venue.city +
                "\n" + (moment(response.data[i].datetime).format("MM/DD/YYYY"))
            console.log(concertThisResults);
    }})
    .catch(function (error) {
        console.log(error);
    });
}

function spotifyThisSong(query) {
    spotify
    .search({ type: 'track', query: query })
    
    .then(function(response) {
        for (var i = 0; i < 5; i++) {
            var spotifyResults = 
                "\nArtist: " + response.tracks.items[i].artists[0].name + 
                "\nSong Name: " + response.tracks.items[i].name +
                "\nAlbum Name: " + response.tracks.items[i].album.name +
                "\nPreview Link: " + response.tracks.items[i].preview_url;
            console.log(spotifyResults);
        }
    })
    .catch(function(err) {
        console.log(err);
    });
};