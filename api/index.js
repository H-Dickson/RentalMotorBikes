import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import Stripe from "stripe";
import cors from "cors"; // Import CORS middleware
import cron from "node-cron";
import authRoute from "./routes/auth.js";
import bikesRoute from "./routes/bikes.js";
import usersRoute from "./routes/users.js";
import rentalsRoute from "./routes/rentals.js";
import mapsRoute from "./routes/maps.js";
import { getTotal } from "./controllers/rentalcontroller.js";
import Rental from "./models/Rental.js";
import axios from "axios";

const app = express();
dotenv.config();

// Connect to MongoDB
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to MongoDB");
    } catch (error) {
        throw error;
    }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20"
  });

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB Disconnected");
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from frontend
  credentials: true  // Allow cookies to be sent
}));

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/bikes", bikesRoute);
app.use("/api/users", usersRoute);
app.use("/api/rentals", rentalsRoute);
app.use("/api/maps", mapsRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

app.get("/config", (req, res) =>{
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});

app.post("/create-payment-intent", async (req, res) => {
  const total = await getTotal(req.body.rentalId);
  console.log(total)
  const amountInCents = parseInt(total* 100) ; // Parse total to integer and convert to cents
    console.log(amountInCents);   
  try {
    
    const paymentIntent = await stripe.paymentIntents.create({
        currency: "nzd",
        amount: amountInCents,
        automatic_payment_methods: {
            enabled: true,
        },
    });
    res.send({clientSecret: paymentIntent.client_secret})   
    } catch (e) {
        return res.status(400).send({
            error:{
                message: e.message,
            },
        })
    }
});


cron.schedule('*/5 * * * *', async () => {
    console.log('Running a task every 5 minutes to check for expired rentals.');

    try {
        const currentTime = new Date();
        // Query for rentals that are not accepted and past the expiration time
        const expiredRentals = await Rental.find({
            deleted: false,
            accepted: false,
            expiresAt: { $lt: currentTime }
        });

        // Update each expired rental to set it as deleted
        const updates = expiredRentals.map(rental => 
            Rental.updateOne({ _id: rental._id }, { deleted: true })
        );

        // Execute all updates
        await Promise.all(updates);

        console.log(`${updates.length} rentals marked as deleted.`);
    } catch (error) {
        console.error('Error running the rental expiration task:', error);
    }
});

// Start server
const PORT = process.env.PORT || 8800;
app.listen(PORT, async () => {
    await connect(); // Connect to MongoDB
    console.log(`Server is running on http://localhost:${PORT}`);
});
