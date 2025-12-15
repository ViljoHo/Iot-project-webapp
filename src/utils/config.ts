require('dotenv').config()
import fs from 'fs'

let PORT = process.env.PORT
let MONGODB_URI = process.env.NODE_ENV ==='test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL
const MQTT_PORT = process.env.MQTT_PORT ? parseInt(process.env.MQTT_PORT) : undefined
const MQTT_USERNAME = process.env.MQTT_USERNAME
const MQTT_PASSWORD = process.env.MQTT_PASSWORD
const MQTT_CA_PATH = process.env.MQTT_CA_PATH || process.env.MQTT_CA

if (!PORT) {
    PORT = '3001'
}

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined')
}


let MQTT_CA: Buffer | undefined = undefined
if (MQTT_CA_PATH) {
  try {
    if (fs.existsSync(MQTT_CA_PATH)) {
      MQTT_CA = fs.readFileSync(MQTT_CA_PATH)
    } else {
      MQTT_CA = Buffer.from(MQTT_CA_PATH)
    }
  } catch (err) {
    console.warn('Failed to load MQTT CA:', err)
  }
}


export default {
    MONGODB_URI,
    PORT,
    MQTT_BROKER_URL,
    MQTT_PORT,
    MQTT_USERNAME,
    MQTT_PASSWORD,
    MQTT_CA,
}