import express from "express";
import { getCities} from "../controllers/mapcontroller.js";
const router = express.Router();

router.get("/cities", getCities);



export default router