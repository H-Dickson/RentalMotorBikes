import { updateUser,deleteUser,getUser, getUsers, updatePassword, deleteUserSelf, getSafeUser} from "../controllers/usercontroller.js";
import express from "express";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifytoken.js";
import { getUserBikes } from "../controllers/bikecontroller.js";

const router = express.Router();

//DELETEUSER
router.put("/delete/:id", verifyUser, deleteUserSelf);

//UPDATE
router.put("/:id", verifyUser, updateUser);
    
//DELETE
router.delete("/:id", verifyAdmin, deleteUser);
    
//GET
router.get("/:id", verifyUser, getUser);

//SAFEGET
router.get("/account/:id", getSafeUser);
  
//GETALL
router.get("/", verifyAdmin, getUsers);

//UPDATE PASSWORD
router.put("/updatepassword/:id", verifyUser, updatePassword);

export default router