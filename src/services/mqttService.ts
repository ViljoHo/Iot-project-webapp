import mqtt from 'mqtt'
import config from '../utils/config'
//import { Weather } from '../types'
import weather from '../models/weather'
import { BatchBuffer, Weather } from '../types'

const createWeatherInfo = async (data: Weather) => {
  const newWeather = new weather({
    temperature: data.temperature,
    pressure: data.pressure,
    timestamp: data.timestamp ?? new Date()
  })
  
  await newWeather.save()
  
}

const buffer: BatchBuffer = {
  temperatures: [],
  pressures: []
}


export const init = () => {
  if (!config.MQTT_BROKER_URL) {
    console.warn('MQTT_BROKER_URL not defined — skipping MQTT init')
    return
  }

  const options: mqtt.IClientOptions = {
    username: config.MQTT_USERNAME,
    password: config.MQTT_PASSWORD,
    port: config.MQTT_PORT,
    protocol: 'mqtts'
  }
  if (config.MQTT_CA) {
    options.ca = config.MQTT_CA
  }

  const client = mqtt.connect(config.MQTT_BROKER_URL, options)

  client.on('connect', () => {
    console.log('MQTT connected')
    client.subscribe('picow/temp', (err) => {
      if (err) console.error('subscribe picow/temp error', err)
    })
    client.subscribe('picow/pressure', (err) => {
      if (err) console.error('subscribe picow/pressure error', err)
    })

    const BATCH_INTERVAL_MS = 60_000 // 1 minute

    setInterval(async () => {
      if (buffer.temperatures.length === 0 || buffer.pressures.length === 0) {
        console.log('No data this interval, skipping')
        return
      }

      // Calculate averages
      const avgTemp = buffer.temperatures.reduce((a, b) => a + b, 0) / buffer.temperatures.length
      const avgPressure = buffer.pressures.reduce((a, b) => a + b, 0) / buffer.pressures.length

      try {
        await createWeatherInfo({
          temperature: avgTemp,
          pressure: avgPressure,
          timestamp: new Date()
        })
        console.log(`Saved batch: temp=${avgTemp.toFixed(2)}, pressure=${avgPressure.toFixed(2)}`)
      } catch (err) {
        console.error('Failed to save batch', err)
      }

      // Clear buffers
      buffer.temperatures = []
      buffer.pressures = []
    }, BATCH_INTERVAL_MS)
  })

  client.on('message', (topic, payload) => {

    const text = payload.toString()
    const value = parseFloat(text)
    if (Number.isNaN(value)) {
      console.warn('Invalid payload for', topic, text)
      return
    }
    if (topic === 'picow/temp') {
      buffer.temperatures.push(value)
    } else if (topic === 'picow/pressure') {
      buffer.pressures.push(value)
    }
  })

  client.on('error', (err) => {
    console.error('MQTT error', err)
  })
}

export default { init }