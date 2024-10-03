
const express = require("express");
const {
  riderRegister,
  riderLogin,
  riderVerifyRegister,
  verifyRiderLogin,
  riderProfile,
  riderVehicle,
  riderAddVehicle,
  riderView_a_Vehicle,
  update_a_vehicle,
} = require("../controllers/Rider");

const RiderRouter = express.Router();
const { authenticateToken } = require("../middlewares/authenticateToken");

// ? rider register
RiderRouter.post("/register", riderRegister);

// ? rider login
RiderRouter.post("/login", riderLogin);

// ? verify registration
RiderRouter.post("/verify-register", riderVerifyRegister);

// ? verify login
RiderRouter.post("/verify-login", verifyRiderLogin);

// ? Get rider's profile
RiderRouter.get("/profile", authenticateToken, riderProfile);

// ? Get rider's vehicle
RiderRouter.get("/my-vehicle", authenticateToken, riderVehicle);

// ? Add more vehicle
RiderRouter.get("/add-vehicle", authenticateToken, riderAddVehicle);

// ? View a vehicle
RiderRouter.get("/view-a-vehicle/:id", authenticateToken, riderView_a_Vehicle);

// ? Update a vehicle
RiderRouter.get("/update-a-vehicle/:id", authenticateToken, update_a_vehicle);

module.exports = RiderRouter;
