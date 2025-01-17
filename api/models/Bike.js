import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';
const { Schema } = mongoose;


const BikeSchema = new mongoose.Schema({
    deleted: {
        type: Boolean,
        default: false
    },
    owner_id: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true,
    },
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    submodel: {
        type: String,
    },
    registration: {
        type: String,
        required: true,
        unique: true
    },
    vin: {
        type:String,
        required: true,
        unique: true,
    },
    description: {
        type:String,
        required: true,
    },
    condition: {
        type:String,
        required:true,
    },
    parts: {
        type: [String],
    },
    location: {
        lat: {
            type: Number,
            required: true
        },
        lon: {
            type: Number,
            required: true
        }
    },
    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        region: {
            type: String,
            required: true
        },
        postcode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    unavailable: {
        type: [Date]
    }
    
});

BikeSchema.plugin(uniqueValidator);


export default mongoose.model("Bike", BikeSchema)