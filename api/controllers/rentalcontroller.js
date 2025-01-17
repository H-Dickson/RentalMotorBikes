import Rental from "../models/Rental.js";
import Bike from "../models/Bike.js";


function getAllDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= new Date(endDate)) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

export const getTotal = async (rentalId) => {
  if (!rentalId) {
    throw new Error('rentalId is required');
  }
  const rental = await Rental.findById(rentalId);
  if (!rental) {
    throw new Error('Rental not found');
  }
  return rental.total;
};

export const createRental = async (req, res, next) => {
  const expirationDuration = 3000000; // 24 hours in milliseconds
  const expiresAt = new Date(Date.now() + expirationDuration);  
  console.log(expiresAt)
  const newRental = new Rental({
    ...req.body,
  expiresAt: expiresAt});
  console.log(newRental)
  try {
    const savedRental = await newRental.save();
    const bike = await Bike.findById(savedRental.bike_id);
    if (!bike.unavailable) {
      bike.unavailable = [];
    }
    
    // Generate all dates for the rental period
    const rentalDates = getAllDatesBetween(savedRental.date.start, savedRental.date.end);
    // Add each date to the bike's unavailability
    rentalDates.forEach(date => {
      bike.unavailable.push(date);
    });
    await bike.save();
    res.status(200).json(savedRental);
  } catch (err) {
    console.log("error")
    console.log(err.message); 
    next(err);
  }
};

export const getRental = async (req, res, next) => {
  try {
    const rental = await Rental.findById(req.params.id);
    res.status(200).json(rental);
  } catch (err) {
    next(err);
  }
};

export const getRentals = async (req, res, next) => {
  try {
    const rentals = await Rental.find();
    res.status(200).json(rentals);
  } catch (err) {
    next(err);
  }
};

export const getRentalsForBike = async (req, res, next) => {
    try {
      const rentals = await Rental.find({ bike_id: req.params.id });
      res.status(200).json(rentals);
    } catch (err) {
      next(err);
    }
  };

  export const getRentalsForUser = async (req, res, next) => {
    try {
      const rentals = await Rental.find({ user_id: req.params.id});
      res.status(200).json(rentals);
    } catch (err) {
      next(err);
    }
  };

  // Separate function for common deletion logic (removing unavailable dates)
  async function removeUnavailableDates(rentalId) {
    const rentalToDelete = await Rental.findById(rentalId);
    if (!rentalToDelete) {
      throw new Error("Rental not found");
    }
    console.log("test")
    const bike = await Bike.findById(rentalToDelete.bike_id);
    if (bike && bike.unavailable) {
      // Corrected to compare the start and end dates of the rental
      const rentalDates = getAllDatesBetween(rentalToDelete.date.start, rentalToDelete.date.end);

      bike.unavailable = bike.unavailable.filter(date => 
        !rentalDates.some(rentalDate => 
          rentalDate.toISOString().split('T')[0] === date.toISOString().split('T')[0]
        )
      );
      await bike.save();
    }
  }

export const deleteRental = async(req, res, next) => {
  try {
    await Rental.findByIdAndDelete(req.params.id);
    await removeUnavailableDates(req.params.id);
    res.status(200).json("Bike deleted");
  } catch (err) {
    next(err);
  }
};

export const deleteRentalForUser = async (req, res, next) => {
  try {
    
    const rental = await Rental.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
    if (!rental) {
      return next(createError(404, 'Rental not found'));
    }
    await removeUnavailableDates(req.params.id);
    res.status(200).json(rental);
  } catch (err) {
    next(err);
  }
};
export const updateRental = async (req, res, next) => {
    try {
      if (!req.body.date || !req.body.date.start || !req.body.date.end) {
        return res.status(400).json({ error: 'Missing date.start and/or date.end in request body' });
      }
  
      const updatedRental = await Rental.findByIdAndUpdate(
        req.params.id,
        { $set: { 'date.start': new Date(req.body.date.start), 'date.end': new Date(req.body.date.end) } },
        { new: true }
      );
      res.status(200).json(updatedRental);
    } catch (err) {
      next(err);
    }
  };

  export const acceptRental = async (req, res, next) =>{
    try{
      const acceptedRental = await Rental.findByIdAndUpdate(
        req.params.id,
        { $set: {"accepted": true}}
      )
      res.status(200).json(acceptedRental);
    }catch(e){
      next(err)
    }
  }
