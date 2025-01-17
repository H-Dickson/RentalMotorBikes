import Bike from "../models/Bike.js"
import { createError } from "../utils/error.js"

export const createBike = async(req, res, next) =>{

        const newBike = new Bike(req.body)
        
        try{
            const savedBike = await newBike.save()
            res.status(200).json(savedBike)
        }catch(err){
            next(err)
        }

}

export const updateBike = async(req, res, next) =>{
    try{
        const updatedBike = await Bike.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true, deleted: false})
        res.status(200).json(updatedBike)
    }catch(err){
        next(err);
    }

}

export const deleteBike = async(req, res, next) =>{

    try{
        await Bike.findByIdAndDelete(req.params.id, {$set: req.body}, {new: true, deleted: false})
        res.status(200).json("Bike deleted")
    }catch(err){
        next(err);
    }
}

export const deleteBikeUser = async (req, res, next) => {
    try {
      const bike = await Bike.findByIdAndUpdate(
        req.params.id,
        { deleted: true },
        { new: true }
      );
      if (!bike) {
        return next(createError(404, 'bike not found'));
      }
      res.status(200).json(bike);
    } catch (err) {
      next(err);
    }
  };

export const getBike = async(req, res, next) =>{

    try{
        const bike = await Bike.findById(req.params.id)
        if(!bike || bike.deleted) return next(createError(404, "Bike not found"))
        res.status(200).json(bike)
    }catch(err){
        next(err);
    }

}

export const getUserBikes = async(req, res, next) =>{

    try{
        const bike = await Bike.find({owner_id: req.params.id, deleted: false })
        res.status(200).json(bike)
    }catch(err){
        next(err);
    }

}

export const getBikes = async(req, res, next) =>{

    try{
        const bikes = await Bike.find({deleted: false})
        res.status(200).json(bikes)
    }catch(err){
        next(err)
    }

}

