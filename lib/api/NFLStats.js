import express from 'express';
import * as nflMethods from '../methods/nflInfoMethods';
let router = express.Router();

router.get('/', (req, res) => {
   res.status(200).send({
       message: "done"
   })
});

router.get('/scores/current', (req, res) => {
    nflMethods.getCurrentGameData(res);
});

router.get('/stats/:week/:pos', (req, res) =>{
    let info = {
        week: req.params.week,
        position: req.params.pos
    };
    nflMethods.getThisWeeksStats(res, info);
});

export default router