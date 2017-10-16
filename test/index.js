var http = require('http'),
    assert = require('assert'),
    server = '../lib/server';

var espnURL = "http://www.nfl.com/scores";

describe('Example Node Server', () => {
    it('should return 200', done => {
        http.get('localhost:3000', res => {
            assert.equal(200, res.statusCode);
            done();
        });
    });

    it('should return game center links', done => {
    })
});