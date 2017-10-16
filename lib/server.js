import express from 'express';
import bodyParser from 'body-parser';
import { parseString } from 'xml2js';
import axios from 'axios';
import prettyjson from 'prettyjson';
import cherrio from 'cheerio';
import pretty from 'pretty';
import fs from 'fs';

let espnURL = "http://www.nfl.com/scores";
let scores = "scores";
let app = express();

let prettyJsonOptions = {
    keysColor: 'america',
    dashColor: 'magenta',
    stringColor: 'white'
};

app.use(bodyParser.json());

let getGameData = () => {
    axios.get(espnURL)
        .then(response => {
            let $ = cherrio.load(response.data);
            let dayScores = {};
            let awayTeamData = $('div.away-team').children('div.team-data').children('div.team-info').children('p.team-name').map((index, element) => {
                let teamName = element['children'][0]['children'][0].data;
                let teamScore = element['parent']['next']['next']['children'][0]['data'];
                return {
                    'name': teamName,
                    'score': teamScore
                };
            });

            // when games r going on new-score-box-wrapper active

            let homeTeamData = $('div.home-team').children('div.team-data').children('div.team-info').children('p.team-name').map((index, element) => {
                let teamName = element['children'][0]['children'][0].data;
                let teamScore = element['parent']['next']['next']['children'][0]['data'];
                return {
                    'name': teamName,
                    'score': teamScore
                };
            });

            for(let key in awayTeamData){
                if(!isNaN(key)){
                    dayScores[key] = {
                        'away':{
                            'name': awayTeamData[key]['name'],
                            'score': awayTeamData[key]['score']
                        },
                        'home':{
                            'name': homeTeamData[key]['name'],
                            'score': homeTeamData[key]['score']
                        }
                    };
                }
            }
            return dayScores;
        })
        .then(val => {
            // console.log('fired event');
            // console.log(prettyjson.render(val, prettyJsonOptions));
        })
        .catch(err => {
            console.log(err);
        });
    };

getGameData();
//firing webscraper every second
// setInterval(getGameData, 60000);

let linksToGameCenter = [];

let getPlayerStatsPerGame = () => {
  axios.get(espnURL)
      .then(response => {
          let $ = cherrio.load(response.data);
          $('div.game-center-area').children('a').map((index, element) => {
              console.log('');
              console.log(element['attribs']['href']);
              linksToGameCenter.push(element['attribs']['href']);
          });
      })
};

getPlayerStatsPerGame();
setInterval(() =>{
    console.log(linksToGameCenter);
}, 9000);

let server = app.listen(3000, () => {
    console.log("start localhost 3000");
});

export default server;


