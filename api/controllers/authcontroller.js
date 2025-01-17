import User from "../models/User.js"
import bcrypt from "bcryptjs"
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken"


export const register = async (req,res,next) =>{
    try{
        // Check if the email is already in use
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return next(createError(409, "Email is already in use"));
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({
            name:req.body.name,
            email:req.body.email,
            password:hash,
            phone: req.body.phone,
            address: {
                street: req.body.address.street,
                city: req.body.address.city,
                region: req.body.address.region,
                postcode: req.body.address.postcode,
                country: req.body.address.country,
            },
            Riding: req.body.Riding,
            Additional: req.body.Additional,
            isAdmin: false,
        })

        await newUser.save()
        res.status(200).send("User created")
    }catch(err){
        next(err)
    }
}
export const login = async (req,res,next) =>{
    try{
        const user = await User.findOne({email: req.body.email});
        if(!user) return next(createError(404, "User not found!"))
        if(user.deleted === true) return next(createError(404, "Account has been deleted"))
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
        if(!isPasswordCorrect) 
            return next(createError(400, "Wrong password or email"))
        const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT);
        const {password, isAdmin, ...otherDetails} = user._doc;
        res.cookie("access_token", token,{
            httpOnly:true,
        }).status(200).json({...otherDetails});
    }catch(err){
        next(err)
    }
}

