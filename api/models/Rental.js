import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';
import { createError } from "../utils/error.js";
const { Schema } = mongoose;


const RentalSchema = new mongoose.Schema({
    expiresAt: {
        type: Date,
        required: true
      },
    deleted: {
        type: Boolean,
        default: false,
    },
    accepted: {
        type: Boolean,
        default: false
    },
    owner_id: {
        type: String,
        required: true
    },
    bike_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    date: {
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        }
    },
    selectedInsurance: {
        type:String,
        required: true
    },
    roadsideAssistance: {
        type: Boolean,
        required: true
    }
});

RentalSchema.index({
    "owner_id": 1,
    "bike_id": 1,
    "user_id": 1,
    "price": 1,
    "img": 1,
    "date.start": 1,
    "date.end": 1,
    "deleted": 1 // Include the deleted field in the index
}, { unique: true });

RentalSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

RentalSchema.pre('save', async function (next) {
    const thisRental = this;
    const overlappingRental = await this.constructor.findOne({
        bike_id: thisRental.bike_id,
        deleted: false, // Only consider rentals that are not marked as deleted
        $or: [
          { 'date.start': { $gte: thisRental.date.start, $lte: thisRental.date.end } },
          { 'date.end': { $gte: thisRental.date.start, $lte: thisRental.date.end } },
          { 'date.start': { $lte: thisRental.date.start }, 'date.end': { $gte: thisRental.date.end } }
        ]
      });
    if (overlappingRental) {
      next(createError(409, "Overlapping rental exists"));
    } else {
      next();
    }
  });

export default mongoose.model('Rental', RentalSchema);