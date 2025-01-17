import express from "express";
import { createError } from "../utils/error.js";
import { verifyAdmin, verifyOwner, verifyRental, verifyRentalOwner, verifyRentalOwnerUser, verifyUser } from "../utils/verifytoken.js";
import { acceptRental, createRental, deleteRental, deleteRentalForUser, getRental, getRentals, getRentalsForBike, getRentalsForUser, updateRental } from "../controllers/rentalcontroller.js";
const router = express.Router();

//CREATE
router.post("/:id", verifyRental, createRental);

//DELETEFORUSER
router.put("/delete/:id", verifyRentalOwnerUser,  deleteRentalForUser);
    
//DELETE
router.delete("/:id", verifyAdmin,  deleteRental);
//GET
router.get("/find/:id", verifyRentalOwnerUser, getRental);
  
//GETALL
router.get("/", verifyAdmin, getRentals);

//GETALLFORBIKE
router.get("/bike/:id", verifyOwner, getRentalsForBike);

//GETALLFORUSER
router.get("/user/:id", verifyUser, getRentalsForUser)

//ACCEPTRENTAL
router.put("/accept/:id", verifyRentalOwner, acceptRental)

//UPDATERENTAL
router.put("/:id",  verifyRentalOwnerUser, updateRental);


  
export default router