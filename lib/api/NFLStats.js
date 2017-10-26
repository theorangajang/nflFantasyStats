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

router.get('/stats/current/:pos', (req, res) =>{
    nflMethods.getThisWeeksStats(res, req.params.pos);
});

export default router