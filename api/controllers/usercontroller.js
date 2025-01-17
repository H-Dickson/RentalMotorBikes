import Bike from "../models/Bike.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";


export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    console.log(user)
    // Manually check and set each allowed field
    if (req.body.name) user.name = req.body.name;
    if (req.body.phone) user.phone = req.body.phone;
    // Add checks and updates for other allowed fields similarly
    if (req.body.address) {
      user.address = { ...user.address, ...req.body.address };
      // For nested fields like address, merge the updates carefully
    }
    if (req.body.Riding) user.Riding = req.body.Riding;
    if (req.body.Additional) user.Additional = req.body.Additional;

    // Save the updated user document
    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}
export const deleteUser = async (req,res,next)=>{
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
}

export const deleteUserSelf = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    );
    if (!user) {
      return next(createError(404, 'user not found'));
    }
    await Bike.updateMany(
      { owner_id: req.user.id },
      { $set: { deleted: true } }
    );
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req,res,next)=>{
  try {
    const user = await User.findById(req.params.id);
    if(!user || user.deleted) {
      return createError(404, "User not found");
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}
export const getUsers = async (req,res,next)=>{
  try {
    const users = await User.find({deleted: false});
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

export const getSafeUser = async (req,res,next) =>{
  try {
    const user = await User.findById(req.params.id);
    if(!user || user.deleted) {
      return createError(404, "User not found");
    }
    const { name, address, Riding, img, additional } = user;
    const city = address?.city ?? 'City not provided'; // Fallback if city is not available
    const safeUser = { name, city, Riding, img, additional};
    res.status(200).json(safeUser);
  } catch (err) {
    next(err);
  }
}

export const updatePassword = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { password: hashedPassword } },
      { new: true }
    );
    res.status(200).json("Password has been updated.");
  } catch (err) {
    next(err);
  }
};