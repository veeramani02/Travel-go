import Trip from "../models/Trip.js";

export const createTrip = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      pickupState,
      pickupCity,
      destinationState,
      destinationCity,
      dateAndTime,
      vehicleType,
      passengers,
      specialRequest,
      driverId,
      vehicleId,
      estimatedDuration,
      estimatedDistance,
      pickupCoordinates,
      destinationCoordinates,
    } = req.body;
    const dateobj = new Date(dateAndTime);
    const date = dateobj;
    const time = dateobj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const baseprice = 500;
    const amount = baseprice * passengers;
    const trip = await Trip.create({
      userId: req.user.id,
      name,
      phone,
      email,
      pickupState,
      pickupCity,
      destinationState,
      destinationCity,
      dateAndTime,
      date,
      time,
      vehicleType,
      passengers,
      specialRequest,
      amount,
      status: "pending",
      paymentStatus: "pending",
      paymentExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      driverId,
      vehicleId,
      estimatedDuration: Number(estimatedDuration),
      estimatedDistance: Number(estimatedDistance),
      pickupCoordinates,
      destinationCoordinates,
    });
    res.status(201).json({
      success: true,
      message: "Trip created successfully",
      trip,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create trip",
    });
  }
};

export const updateTripStatuses = async () => {
  const now = new Date();
  const trips = await Trip.find({
    status: { $in: ["assigned", "current"] },
  });
  for (let trip of trips) {
    const tripDate = new Date(trip.dateAndTime);
    if (trip.status === "assigned" && tripDate <= now) {
      trip.status = "current";
    }
    const endTime = new Date(
      tripDate.getTime() +
        (Number(trip.estimatedDuration) || 4) * 60 * 60 * 1000,
    );
    if (trip.status === "current" && now >= endTime) {
      trip.status = "completed";
    }
    if (trip.isModified()) {
      await trip.save();
    }
  }
};

export const getLatestTrip = async (req, res) => {
  try {
    await updateTripStatuses();

    const trip = await Trip.findOne({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    if (!trip) {
      return res.status(404).json({ message: "No trips found" });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUpcomingTrips = async (req, res) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const trips = await Trip.find({
      userId: req.user._id,
      dateAndTime: {
        $gte: today,
      },
    })
      .sort({ dateAndTime: 1 })
      .lean();

    if (trips.length === 0) {
      return res.status(404).json({ message: "No trips found" });
    }

    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPastTrips = async (req, res) => {
  try {
    await updateTripStatuses();
    const userId = req.user._id;
    const pastTrips = await Trip.find({ userId })
      .sort({ createdAt: -1 })
      .skip(1)
      .limit(5);
    res.json(pastTrips);
  } catch (err) {
    console.log("GET PAST TRIPS ERROR", err);
    res.status(500).json({ message: err.message });
  }
};

export const getTrips = async (req, res) => {
  try {
    await updateTripStatuses();
    const trip = await Trip.find();
    if (!trip || trip.length === 0) {
      return res.status(404).json({
        message: "No trips found",
      });
    }
    res.json(trip);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getRoute = async (req, res) => {
  const { start, end } = req.query;
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`,
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Route fetch failed" });
  }
};

export const updateTrips = async (req, res) => {
  try {
    console.log(req.body);
    await updateTripStatuses();
    const { _id, driverId, vehicleId } = req.body;

    if (!driverId)
      return res.status(400).json({
        message: "Assign driver require",
      });

    if (!vehicleId)
      return res.status(400).json({
        message: "Assign vehicle require",
      });

    if (!_id) {
      return res.status(400).json({
        message: "Trip ID is required",
      });
    }
    const updatedTrip = await Trip.findByIdAndUpdate(
      _id,
      {
        ...(driverId && {
          driverId: driverId.toString(),
        }),
        ...(vehicleId && { vehicleId }),
        ...(driverId && {
          status: "assigned",
        }),
      },
      { new: true },
    );

    if (!updatedTrip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trip updated successfully",
      trip: updatedTrip,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const cancelTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }
    if (trip.status === "completed") {
      return res.status(400).json({
        message: "Completed trip cannot be cancelled",
      });
    }
    if (trip.status === "cancelled") {
      return res.status(400).json({
        message: "Trip is already cancelled",
      });
    }
    trip.status = "cancelled";
    await trip.save();
    return res.status(200).json({
      success: true,
      message: "Trip cancelled successfully",
      trip,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
