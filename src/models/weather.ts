import mongoose from "mongoose";

const weatherSchema = new mongoose.Schema({
    temperature: {
        type: Number,
        required: true
    },
    pressure: {
        type: Number,
        required: true
    },
    timestamp: { type: Date, default: Date.now }
});

weatherSchema.set('toJSON', {
    transform: (_document, returnedObject: any) => {
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

export default mongoose.model('Weather', weatherSchema);