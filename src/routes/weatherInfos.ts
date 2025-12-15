import express from 'express';

import weatherService from '../services/weatherService';

const router = express.Router();

router.get('/', async (_req, res) => {
    const weatherInfos = await weatherService.getAllWeatherInfos();
    res.json(weatherInfos);
});


export default router;
