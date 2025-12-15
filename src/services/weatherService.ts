import { Weather } from "../types";

import weather from "../models/weather";

const getAllWeatherInfos = async (): Promise<Weather[]> => {
    const weatherInfos = await weather.find({});
    return weatherInfos;
}

const getBetweenTimestamps = async (start: Date, end: Date): Promise<Weather[]> => {
    const weatherInfos = await weather.find({
        timestamp: {
            $gte: start,
            $lte: end
        }
    });
    return weatherInfos;
}


export default {
    getAllWeatherInfos,
    getBetweenTimestamps,
};