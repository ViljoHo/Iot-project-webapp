import express from 'express';

import weatherService from '../services/weatherService';

const router = express.Router();

router.get('/', async (_req, res) => {
    const weatherInfos = await weatherService.getAllWeatherInfos();
    res.json(weatherInfos);
});

router.get('/between', async (req, res) => {
    const { start, end } = req.query;

    if (!start || !end) {
        return res.status(400).json({ error: 'start and end query parameters are required' });
    }

    const startDate = new Date(start as string);
    const endDate = new Date(end as string);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format for start or end' });
    }

    const weatherInfos = await weatherService.getBetweenTimestamps(startDate, endDate);
    return res.json(weatherInfos);
});


export default router;
