import axios from 'axios';
import prettyjson from 'prettyjson';
import cherrio from 'cheerio';
import pretty from 'pretty';
import EventEmitter from 'events';

//URL Links
let nflURL = "http://www.nfl.com";
let nflURLForScores = `${nflURL}/scores`;
let yahooScoreBoard = "https://sports.yahoo.com/nfl/scoreboard/";
let yahooQBStats = "https://sports.yahoo.com/nfl/stats/weekly/?sortStatId=PASSING_YARDS&selectedTable=0&week";
let yahooRBStats = "https://sports.yahoo.com/nfl/stats/weekly/?sortStatId=RUSHING_YARDS&selectedTable=1&week";
let yahooWRStats = "https://sports.yahoo.com/nfl/stats/weekly/?sortStatId=RUSHING_YARDS&selectedTable=2&week";
let yahooDEFStats = "https://sports.yahoo.com/nfl/stats/weekly/?sortStatId=RUSHING_YARDS&selectedTable=7&week";
let scores = "scores";

//Position Arrays
let qbList = {};
let rbList = {};
let wrList = {};
let defList = {};

//EventEmitter

const events = new EventEmitter();

//settings for prettyjson mod
let prettyJsonOptions = {
    keysColor: 'america',
    dashColor: 'magenta',
    stringColor: 'white'
};

export let getCurrentGameData = (res) => {
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
        .then((scores) => {
            res.send({
                gameScores: scores
            });
        })
        .catch(err => {
            console.log(err);
        });
};

export let getThisWeeksStats = (res, urlInfo) => {
    axios.get(yahooScoreBoard)
        .then(response => {
            getCurrentWeekData(response, urlInfo.week);
            return [yahooQBStats,yahooRBStats, yahooWRStats, yahooDEFStats];
        })
        .then((links) => {
            switch (urlInfo.position){
                case 'qb':
                    getQBStats(res, links[0]);
                    break;
                case 'rb':
                    getRBStats(res, links[1]);
                    break;
                case 'wr':
                    getWRStats(res, links[2]);
                    break;
                case 'def':
                    getDEFStats(res, links[3]);
                    break;
                default:
                    break;
            }
        })
        .catch(err => {
            console.log(err);
        });

};

let getQBStats = (resp, qbLink) => {
    return axios.get(qbLink)
        .then(response => {
            let playerInfo = [];
            let $ = cherrio.load(response.data);
            $('table.graph-table').children('tbody').children('tr').map((index, element) => {
                playerInfo.push(element['children']);
            });
            return playerInfo;
        })
        .then((info) => {
            info.map((specificPlayerInfo, index) => {
                let qbPlayer = {};
                let playerIndex = info[index];

                //Name
                let qbName = playerIndex[0]['children'][0]['children'][0]['children'][0]['data'];

                //Team
                qbPlayer['Team'] = playerIndex[1]['children'][0]['children'][0]['data'];

                //QBR
                qbPlayer['qbr'] = checkIfStatIsUndefined(playerIndex, 2);

                //Comp
                qbPlayer['completions'] = checkIfStatIsUndefined(playerIndex, 3);

                //Att
                qbPlayer['attempts'] = checkIfStatIsUndefined(playerIndex, 4);

                //PCT
                qbPlayer['comp_percent'] = checkIfStatIsUndefined(playerIndex, 5);

                //YDS
                qbPlayer['yards'] = checkIfStatIsUndefined(playerIndex, 6);

                //Y/A
                qbPlayer['yards_per_att'] = checkIfStatIsUndefined(playerIndex, 7);

                //TD
                qbPlayer['td'] = checkIfStatIsUndefined(playerIndex, 7);

                //Int
                qbPlayer['interceptions'] = checkIfStatIsUndefined(playerIndex, 9);

                //1stD
                qbPlayer['first_downs'] = checkIfStatIsUndefined(playerIndex, 10);

                //Sacks
                qbPlayer['sacks'] = checkIfStatIsUndefined(playerIndex, 11);

                //YdsL
                qbPlayer['yards_lost'] = checkIfStatIsUndefined(playerIndex, 12);
                qbList[qbName] = qbPlayer;
            });
            return qbList;
        })
        .then((players) => {
            resp.status(200).send({
                qb: players
            })
        })
        .catch(err => {
            console.log(err);
        })
};

let getRBStats = (resp, rbLink) => {
    axios.get(rbLink)
        .then(response => {
            let playerInfo = [];
            let $ = cherrio.load(response.data);
            $('table.graph-table').children('tbody').children('tr').map((index, element) => {
                playerInfo.push(element['children']);
            });
            return playerInfo;
        })
        .then((info) => {
            info.map((specificPlayerInfo, index) => {
                let rbPlayer = {};
                let playerIndex = info[index];
                //Name
                let rbName = playerIndex[0]['children'][0]['children'][0]['children'][0]['data'];

                //Team
                rbPlayer['team'] = playerIndex[1]['children'][0]['children'][0]['data'];

                //Att
                rbPlayer['attempts'] = checkIfStatIsUndefined(playerIndex, 2);

                //Yards
                rbPlayer['yards'] = checkIfStatIsUndefined(playerIndex, 3);

                //Y/A
                rbPlayer['yards_per_attempt'] = checkIfStatIsUndefined(playerIndex, 4);

                //1stDs
                rbPlayer['first_downs'] = checkIfStatIsUndefined(playerIndex, 5);

                //Long
                rbPlayer['longest_drive'] = checkIfStatIsUndefined(playerIndex, 6);

                //Fumble
                rbPlayer['fumbles'] = checkIfStatIsUndefined(playerIndex, 7);

                //TD
                rbPlayer['td'] = checkIfStatIsUndefined(playerIndex, 8);
                rbList[rbName] = rbPlayer;
            });
            return rbList;
        })
        .then((players) => {
            resp.status(200).send({
                rb: players
            });
        })
        .catch(err => {
            console.log(err);
        })
};

let getWRStats = (resp, wrLink) => {
    axios.get(wrLink)
        .then(response => {
            let playerInfo = [];
            let $ = cherrio.load(response.data);
            $('table.graph-table').children('tbody').children('tr').map((index, element) => {
                playerInfo.push(element['children']);
            });
            return playerInfo;
        })
        .then((info) => {
            info.map((specificPlayerInfo, index) => {
                let wrPlayer = {};
                let playerIndex = info[index];

                //Name
                let wrName = playerIndex[0]['children'][0]['children'][0]['children'][0]['data'];

                //Team
                wrPlayer['team'] = playerIndex[1]['children'][0]['children'][0]['data'];

                //Att
                wrPlayer['attempts'] = checkIfStatIsUndefined(playerIndex, 2);

                //Yards
                wrPlayer['yards'] = checkIfStatIsUndefined(playerIndex, 3);

                //Y/A
                wrPlayer['yards_per_reception'] = checkIfStatIsUndefined(playerIndex, 4);

                //1stDs
                wrPlayer['first_downs'] = checkIfStatIsUndefined(playerIndex, 5);

                //Long
                wrPlayer['longest_drive'] = checkIfStatIsUndefined(playerIndex, 6);

                //Fumble
                wrPlayer['fumbles'] = checkIfStatIsUndefined(playerIndex, 7);

                //TD
                wrPlayer['td'] = checkIfStatIsUndefined(playerIndex, 8);
                wrList[wrName] = wrPlayer;
            });
            return wrList;
        })
        .then((players) => {
            resp.status(200).send({
                wr: players
            });
        })
        .catch(err => {
            console.log(err);
        })
};

let getDEFStats = (resp, defLink) => {
    axios.get(defLink)
        .then(response => {
            let playerInfo = [];
            let $ = cherrio.load(response.data);
            $('table.graph-table').children('tbody').children('tr').map((index, element) => {
                playerInfo.push(element['children']);
            });
            return playerInfo;
        })
        .then((info) => {
            info.map((specificPlayerInfo, index) => {
                let defPlayer = {};
                let playerIndex = info[index];
                //Name
                let defName = playerIndex[0]['children'][0]['children'][0]['children'][0]['data'];

                //Team
                defPlayer['ast'] = playerIndex[1]['children'][0]['children'][0]['data'];

                //Sack
                defPlayer['total'] = checkIfStatIsUndefined(playerIndex, 2);

                //Yards
                defPlayer['sack'] = checkIfStatIsUndefined(playerIndex, 3);

                //Yards Lost
                defPlayer['yards_lost'] = checkIfStatIsUndefined(playerIndex, 4);

                //Stuff
                defPlayer['stuff'] = checkIfStatIsUndefined(playerIndex, 5);

                //Interception
                defPlayer['interceptions'] = checkIfStatIsUndefined(playerIndex, 6);

                //Interception Yards
                defPlayer['interception_yards'] = checkIfStatIsUndefined(playerIndex, 7);

                defList[defName] = defPlayer;
            });
            return defList;
        })
        .then((players) => {
            resp.status(200).send({
                def: players
            });
        })
        .catch(err => {
            console.log(err);
        })
};

let checkIfStatIsUndefined = (player, index) => {
    return player[index]['children'][0]['children'] ?
        player[index]['children'][0]['children'][0]['data'] : player[index]['children'][0]['data'];
};

let getCurrentWeekData = (response, week) =>{

    let $ = cherrio.load(response.data);
    let weekArray = $('select').data('data-tst', 'column-dropdown')['1']['children'];
    let currentWeek = "=";
    if(week === "current"){
        console.log('getting current');
        for(let i=0; i<=weekArray.length; i++){
            let value = weekArray[i];
            if('selected' in value['attribs']){
                currentWeek += ((Number(value['attribs']['value'])+1)-5);
                yahooQBStats = yahooQBStats.concat(currentWeek);
                yahooRBStats = yahooRBStats.concat(currentWeek);
                yahooWRStats = yahooWRStats.concat(currentWeek);
                yahooDEFStats = yahooDEFStats.concat(currentWeek);
                break;
            }
        }
    }else{
        currentWeek += week;
        yahooQBStats = yahooQBStats.concat(currentWeek);
        yahooRBStats = yahooRBStats.concat(currentWeek);
        yahooWRStats = yahooWRStats.concat(currentWeek);
        yahooDEFStats = yahooDEFStats.concat(currentWeek);
    }
};

