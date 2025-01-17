import express from "express";
import Bike from "../models/Bike.js"
import { createError } from "../utils/error.js";
import { createBike, deleteBike, deleteBikeUser, getBike, getBikes, getUserBikes, updateBike } from "../controllers/bikecontroller.js";
import { declareOwner, verifyAdmin, verifyOwner, verifyUser } from "../utils/verifytoken.js";
const router = express.Router();

//CREATE
router.post("/", declareOwner, createBike);
//UPDATE
router.put("/:id",  verifyOwner, updateBike);
    
//DELETE
router.delete("/:id", verifyAdmin,  deleteBike);

//DELETEFORUSER

router.put("/delete/:id", verifyOwner, deleteBikeUser);
    
//GET
router.get("/find/:id", getBike);
  
//GETUSERBIKES
router.get("/user/:id", getUserBikes);

//GETALL
router.get("/", getBikes);

  
export default router