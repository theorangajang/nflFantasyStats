import axios from 'axios';
import prettyjson from 'prettyjson';
import cherrio from 'cheerio';
import pretty from 'pretty';

let nflURL = "http://www.nfl.com";
let nflURLForScores = `${nflURL}/scores`;
let scores = "scores";
let prettyJsonOptions = {
    keysColor: 'america',
    dashColor: 'magenta',
    stringColor: 'white'
};

export let getGameData = () => {
    axios.get(nflURLForScores)
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
        .catch(err => {
            console.log(err);
        });
};

let linksToGameCenter = [];

let getStatsForEveryPlayerInGame = (links) => {
    links.map((index, element) => {
        axios.get(`${nflURL}${links[element]}`)
            .then(response => {
                // console.log(pretty(response.data, {ocd: true}));
                let $ = cherrio.load(response.data);
                console.log();
                console.log('New Info');
                console.log($('div#analyze-tab-content').children($('div#analyze-channel-content'))['0']['children']);
            });
    });
};

export let getLinksForSpecificGames = () => {
    axios.get(nflURLForScores)
        .then(response => {
            let $ = cherrio.load(response.data);
            $('div.game-center-area').children('a').map((index, element) => {
                linksToGameCenter.push(element['attribs']['href']);
            });
            return linksToGameCenter;
        })
        .then((links) => {
            getStatsForEveryPlayerInGame(links)
        })
        .catch(err => {
            console.log(err);
        })
};
