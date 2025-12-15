import { Weather } from "../types";

import weather from "../models/weather";

const getAllWeatherInfos = async (): Promise<Weather[]> => {
    const weatherInfos = await weather.find({});
    return weatherInfos;
}


export default {
    getAllWeatherInfos,
};