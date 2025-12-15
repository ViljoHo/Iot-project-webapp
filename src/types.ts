export interface Weather {
    temperature: number;
    pressure: number;
    timestamp: Date;
}

export type BatchBuffer = {
  temperatures: number[]
  pressures: number[]
}

