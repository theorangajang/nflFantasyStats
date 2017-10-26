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

describe('Test Links For Current Stats of Positions', () => {
    it('should return the current stats for the qb position', done => {
        chai.request(app)
            .get('/stats/current/qb')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            })
    });

    it('should return the current stats for the rb position', done => {
        chai.request(app)
            .get('/stats/current/rb')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            })
    });

    it('should return the current stats for the wr position', done => {
        chai.request(app)
            .get('/stats/current/wr')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            })
    });

    it('should return the current stats for the def position', done => {
        chai.request(app)
            .get('/stats/current/def')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            })
    });
});
