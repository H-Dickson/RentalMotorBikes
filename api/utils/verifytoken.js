import jwt from "jsonwebtoken"
import Bike from "../models/Bike.js"
import { createError } from "./error.js"
import User from "../models/User.js";
import Rental from "../models/Rental.js";

export const verifyToken = (req,res,next)=>{
    const token = req.cookies.access_token;
    if(!token){
        return next(createError(401,"You are not authenticated!"))
    }
    jwt.verify(token, process.env.JWT, (err, user) =>{
        if(err) return next(createError(401,"Token is not valid!"));
        req.user = user;
        next()    
    });
}

export const verifyUser = (req,res,next) =>{
    verifyToken(req,res, ()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
            return next(createError(403,"You are not authorized!"));
        }
    })
}

export const verifyAdmin = (req, res, next) => {
    verifyToken(req,res, ()=>{
        if(req.user.isAdmin){
            next()
        }else{
            return next(createError(403,"You are not authorized as admin!"));
        }
    });
  };

  export const declareOwner = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.user) {
            console.log(req.user)
            return next(createError(401, "You are not authenticated!"));
        }
        req.body.owner_id = req.user.id;
        next();
    });
};

  export const verifyOwner = async (req, res, next) => {
    verifyToken(req,res, async ()=>{
        const bike = await Bike.findById(req.params.id);
        if(!bike) {
            return next(createError(404, "Bike not found!"));
        }
        if(req.user.id === bike.owner_id || req.user.isAdmin){
            next()
        }else{
            return next(createError(403,"You are not authorized!"));
        }
    })
};

export const verifyRental = async (req, res, next) => {
    verifyToken(req, res, async () => {
        if (!req.user || !req.user.id) {
            return next(createError(404, "User not found"));
        }
        const bike = await Bike.findById(req.params.id);
        const user = await User.findById(req.user.id);
        if(!bike || !user){
            return next(createError(404, "Bike or user not found"))
        }
        req.body.bike_id = bike._id;
        req.body.owner_id = bike.owner_id;
        req.body.user_id = user._id;
        req.body.price = bike.price;
        req.body.img = bike.img;
        req.body.accepted = false;

        next();
    }
    )
}

export const verifyRentalOwnerUser = async (req,res, next) => {
    verifyToken(req,res, async ()=>{
        const rental = await Rental.findById(req.params.id);
        if(req.user.id === rental.user_id || req.user.id === rental.owner_id ||req.user.isAdmin){
            next()
        }else{
            return next(createError(403,"You are not authorized!"));
        }
    })
}

export const verifyRentalOwner = async (req,res, next) => {
    verifyToken(req,res, async ()=>{
        const rental = await Rental.findById(req.params.id);
        if(req.user.id === rental.owner_id ||req.user.isAdmin){
            next()
        }else{
            return next(createError(403,"You are not authorized!"));
        }
    })
}
