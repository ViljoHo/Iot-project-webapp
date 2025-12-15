import config from './utils/config';
import express from 'express';
const app = express();
import weatherRouter from './routes/weatherInfos';

import mongoose from 'mongoose';
import mqttService from './services/mqttService';


mongoose.connect(config.MONGODB_URI)

app.use(express.static('frontend/dist'));

app.use(express.json());

mqttService.init();

//Routers
app.use('/api/weatherInfos', weatherRouter);


export default app;

