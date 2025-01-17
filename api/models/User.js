import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';

const { Schema } = mongoose;


const UserSchema = new mongoose.Schema({
    deleted: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
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
    Riding: {
        type: Number,
        required: true
    },
    Additional:{
        type:String
    },
    img: {
        type: String
    }
},
    {timestamps: true}
);

UserSchema.plugin(uniqueValidator);

export default mongoose.model("User", UserSchema)