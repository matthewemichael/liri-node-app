require("dotenv").config();

// var keys = require("./keys.js");

// var spotify = new Spotify(keys.spotify);
// var Spotify = require('node-spotify-api');

var moment = require('moment');
moment().format();

var axios = require("axios");

var fs = require('fs');

var command = process.argv[2]; 
var query = process.argv[3];

if (command === "concert-this") {
    concertThis(query);
}

function concertThis(query) {
    axios.get("https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp")
    .then(function(response) {    
        console.log(response);

    })
    .catch(function (error) {
        console.log(error);
    });
}