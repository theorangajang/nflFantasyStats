import express from 'express';
import bodyParser from 'body-parser';
import eventEmitter from 'events';
import * as nflStatsMethods from './methods/nflInfoMethods';
let app = express();
let events = new eventEmitter.EventEmitter();

app.use(bodyParser.json());

// firing webscraper every minute
// will need to do this so that it fires every our on thursday
// setInterval(getLinksForSpecificGames, 60000);

events.on('getGameDate', () => {
    nflStatsMethods.getGameData()
});

events.on('getLinksForGames', () => {
    nflStatsMethods.getLinksForSpecificGames();
});

//
events.emit('getGameDate');
events.emit('getLinksForGames');

let server = app.listen(3000, () => {
    console.log("start localhost 3000");
});

export default server;


