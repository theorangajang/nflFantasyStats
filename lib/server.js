import express from 'express';
import bodyParser from 'body-parser';
import router from './api/NFLStats';

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

app.listen(3000, () => {
    console.log("start localhost 3000");
});

module.exports = app;


