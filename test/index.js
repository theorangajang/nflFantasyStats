let http = require('http'),
    assert = require('assert'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    app = require('../lib/server');

chai.use(chaiHttp);

let espnURL = "http://www.nfl.com/scores";
let yahooQBStats = "https://sports.yahoo.com/nfl/stats/weekly/?sortStatId=PASSING_YARDS&selectedTable=0&week=7";
let yahooRBStats = "https://sports.yahoo.com/nfl/stats/weekly/?sortStatId=RUSHING_YARDS&selectedTable=1&week=7";
let yahooWRStats = "https://sports.yahoo.com/nfl/stats/weekly/?sortStatId=RUSHING_YARDS&selectedTable=2&week=7";
let yahooDEFStats = "https://sports.yahoo.com/nfl/stats/weekly/?sortStatId=RUSHING_YARDS&selectedTable=7&week=7";
let localhost = "http://localhost:3000";

describe('Sports Stats Server', () => {
    describe('Test Server Works', () => {
        it('should return 200', done => {
            chai.request(app)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body['message'].should.equal('done');
                    done();
                });
        });
        describe('Test Current Scores', () => {
            it('should return current scores for that week', done => {
                chai.request(app)
                    .get('/scores/current')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.gameScores.should.be.a('object');
                        done();
                    });
            })
        });


    });

    describe('Test Links For Current Stats', () => {
        it('should return the current week number at the end of the yahoo links', done => {
            chai.request(app)
                .get('/stats/current')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    let qb = res.body[0],
                        rb = res.body[1],
                        wr = res.body[2],
                        def = res.body[3];

                    assert.equal(yahooQBStats, qb, 'these are not equal!');
                    assert.equal(yahooRBStats, rb, 'these are not equal!');
                    assert.equal(yahooWRStats, wr, 'these are not equal!');
                    assert.equal(yahooDEFStats, def, 'these are not equal!');
                    done();
                })
        })
    })
});

