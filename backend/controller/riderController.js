const { sendEmail } = require("../lib/email-sender/sender");
const Rider = require("../models/Rider");
const Orders = require("../models/Order");
const Product = require("../models/Products");
const mongoose = require("mongoose");


/** @format */
const riderStatus = require('./riderStatus');
const Rider = require("../models/Rider");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const UserResetToken = require("../models/UserResetToken");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const OtpToken = require("../models/OtpToken");



// ? rider's login
const riderLogin = asyncHandler(async (req, res) => {
  const { phone_number } = req.body;

  // find the user
  const rider = await Rider.findOne({ phone_number });

  // Generate a 6-digit OTP
  const otp = otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
    alphabets: false,
  });

  // Save the OTP to the OTP table
  const loginOTP = new OtpToken({
    rider_id: rider._id,
    type: "rider_login_otp",
    otp,
    expiration_time: new Date(Date.now() + 10 * 60 * 1000), // Set expiration time (e.g., 10 minutes)
  });
  await loginOTP.save();

  // send the otp to the user's email or phone number, we will use termii(SMS) later
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  // Email content
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: rider.email,
    subject: "OTP Request",
    html: `
			<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta http-equiv="X-UA-Compatible" content="IE=edge" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1>OTP!</h1>
					</div>
					<div class="content">
						<p>Here is your ONE-TIME-PASSWORD 😆 please kindly share it with somone, AT YOUR OWN RISK</p>
						<h1>${otp}</h1>
					</div>
				</div>
			</body>
			</html>
		`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(400).json({
        response_code: 400,
        response_message: "Error sending email: " + error,
        data: null,
      });
    } else {
      return res.status(201).json({
        response_code: 201,
        response_message: "Successfull, kindly check your mail for your OTP.",
        data: null,
      });
    }
  });
});

// ? rider's register
const riderRegister = asyncHandler(async (req, res) => {
  const { country, phone_number, email } = req.body;
  // ? checking if user exists with email provided
  const riderExists = await Rider.findOne({
    $or: [{ email: email }, { phone_number: phone_number }],
  });

  if (riderExists) {
    return res.status(400).json({
      response_code: 400,
      response_message: "A rider with the same email or phone number exists",
      data: null,
    });
  }
  const rider = await Rider.create({
    email,
    phone_number,
    country,
  });

  if (!rider) {
    return res.status(400).json({
      response_code: 400,
      response_message: "There was an error with your registration",
      data: null,
    });
  }

  // Generate a 6-digit OTP
  const otp = otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
    alphabets: false,
  });

  // Save the OTP to the OTP table
  const otpToken = new OtpToken({
    rider_id: rider._id,
    type: "rider_otp",
    otp,
    expiration_time: new Date(Date.now() + 10 * 60 * 1000), // Set expiration time (e.g., 10 minutes)
  });
  await otpToken.save();

  // send the otp to the user's email or phone number, we will use termii(SMS) later
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  // Email content
  const mailOptions = {
    from: "your_email@gmail.com",
    to: rider.email,
    subject: "OTP Request",
    html: `
			<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta http-equiv="X-UA-Compatible" content="IE=edge" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1>OTP!</h1>
					</div>
					<div class="content">
						<p>Here is your OTP 😆 please kindly share it with somone, ON YOUR OWN RISK</p>
						<h1>${otp}</h1>
					</div>
				</div>
			</body>
			</html>
		`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(400).json({
        response_code: 400,
        response_message: "Error sending email: " + error,
        data: null,
      });
    } else {
      return res.status(201).json({
        response_code: 201,
        response_message: "Successfully, kindly check your mail for your OTP.",
        data: null,
      });
    }
  });
});

// ? verify register
const riderVerifyRegister = asyncHandler(async (req, res) => {
  const {
    first_name,
    last_name,
    other_name,
    email,
    phone_number,
    country,
    home_address,
    otp,
    profile_image,
    personal_document,
    vehicles,
  } = req.body;

  const updatedData = {
    first_name,
    last_name,
    other_name,
    email,
    phone_number,
    country,
    home_address,
    profile_image: profile_image,
    personal_document: {
      id_type: personal_document?.id_type,
      expiry_date: personal_document?.expiry_date,
      have_a_vehicle: personal_document?.have_a_vehicle,
      document: personal_document?.document,
    },
    vehicles: vehicles.map((vehicle) => {
      return {
        vehicle_info: {
          vehicle_type: vehicle.vehicle_info?.vehicle_type,
          brand: vehicle.vehicle_info?.brand,
          model: vehicle.vehicle_info?.model,
          year: vehicle.vehicle_info?.year,
          color: vehicle.vehicle_info?.color,
          document_1: vehicle.vehicle_info?.document_1,
        },
        vehicle_document: {
          riders_license: vehicle.vehicle_document?.riders_license,
          proof_of_ownership: vehicle.vehicle_document?.proof_of_ownership,
          cert_of_road_worthiness:
            vehicle.vehicle_document?.cert_of_road_worthiness,
          insurance_cert: vehicle.vehicle_document?.insurance_cert,
        },
      };
    }),
  };

  try {
    const riderExist = await Rider.findOne({
      email: email,
    });

    if (!riderExist) {
      return res.status(400).json({
        response_code: 400,
        response_message: "User not found!",
        data: null,
      });
    }

    // Find the OTP token for the user
    const otpToken = await OtpToken.findOne({
      rider_id: riderExist._id,
      is_used: false,
      type: "rider_otp",
    });

    if (!otpToken) {
      return res.status(400).json({
        response_code: 400,
        response_message: "No valid OTP found",
        data: null,
      });
    }

    // Check if the entered OTP matches the stored OTP
    if (otpToken.otp === otp && !isOtpExpired(otpToken.expiration_time, 10)) {
      // OTP is valid, proceed with login logic

      // Mark the OTP as used
      otpToken.is_used = true;
      await otpToken.save();

      // Update the user using updateOne
      const updatedRider = await Rider.updateOne(
        { _id: riderExist._id },
        { $set: updatedData },
        { new: true }
      );

      if (updatedRider) {
        // The update was successful

        // Fetch the updated rider document
        const updatedRiderDocument = await Rider.findOne({
          _id: riderExist._id,
        });

        if (!updatedRiderDocument) {
          return res.status(400).json({
            response_code: 400,
            response_message: "Failed to fetch updated user data",
            data: null,
          });
        }

        const token = jwt.sign(
          { id: updatedRiderDocument._id },
          process.env.JWT_SECRET
        );
        return res.status(200).json({
          token,
          name: updatedRiderDocument.first_name,
          email: updatedRiderDocument.email,
          _id: updatedRiderDocument._id,
        });
      } else {
        // The update was not successful
        return res.status(400).json({
          error: "Failed to update user",
          details: updatedRider,
        });
      }
    } else {
      // Invalid OTP
      return res.status(400).json({
        response_code: 400,
        response_message: "Invalid or Expired OTP",
        data: null,
      });
    }
  } catch (error) {
    console.error("Error finding rider:", error);
    throw error;
  }
});

// ? verify login
const verifyRiderLogin = asyncHandler(async (req, res) => {
  const { phone_number, otp } = req.body;

  // find the user
  const riderExist = await Rider.findOne({ phone_number });
  if (!riderExist) {
    return res.status(400).json({
      response_code: 400,
      response_message: "User not found!",
      data: null,
    });
  }

  if (riderExist && riderExist.isSuspended) {
    return res.status(400).json({
      response_code: 400,
      response_message: "Account suspended! contact ADMIN",
      data: null,
    });
  }

  // verify OTP
  const otpToken = await OtpToken.findOne({
    rider_id: riderExist._id,
    is_used: false,
    type: "rider_login_otp",
  });

  if (!otpToken) {
    return res.status(400).json({
      response_code: 400,
      response_message: "No valid OTP found",
      data: null,
    });
  }

  // Check if the entered OTP matches the stored OTP
  if (otpToken.otp === otp && !isOtpExpired(otpToken.expiration_time, 10)) {
    // OTP is valid, proceed with login logic

    // Mark the OTP as used
    otpToken.is_used = true;
    await otpToken.save();

    const token = jwt.sign({ id: riderExist?._id }, process.env.JWT_SECRET);

    return res.status(200).json({
      token,
      name: riderExist?.first_name,
      email: riderExist?.email,
      _id: riderExist?._id,
    });
  } else {
    // Invalid OTP
    return res.status(400).json({
      response_code: 400,
      response_message: "Invalid or Expired OTP",
      data: null,
    });
  }
});

// ? view profile
const riderProfile = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const rider = await Rider.findOne({ _id: user_id });

  const riderDetails = {
    first_name: rider.first_name,
    last_name: rider.last_name,
    other_name: rider.other_name,
    phone_number: rider.phone_number,
    email: rider.email,
    home_address: rider.home_address,
  };
  return res.status(200).json({
    response_code: 200,
    response_message: "Successful",
    data: riderDetails,
  });
});

// ? view a vehicle
const riderVehicle = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const riders_vehicle = await Rider.findOne({ _id: user_id });

  if (!riders_vehicle) {
    return res.status(404).json({
      response_code: 404,
      response_message: "Rider not found",
      data: null,
    });
  }

  return res.status(200).json({
    response_code: 200,
    response_message: "Successful",
    data: riders_vehicle.vehicles,
  });
});

// ? add a vehicle
const riderAddVehicle = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const riders_vehicle = await Rider.findOne({ _id: user_id });

  if (!riders_vehicle) {
    return res.status(404).json({
      response_code: 404,
      response_message: "Rider not found",
      data: null,
    });
  }

  // Assuming req.body contains details of the new vehicle
  const newVehicle = {
    vehicle_info: {
      vehicle_type: req.body.vehicle_info.vehicle_type,
      brand: req.body.vehicle_info.brand,
      model: req.body.vehicle_info.model,
      year: req.body.vehicle_info.year,
      color: req.body.vehicle_info.color,
      document_1: req.body.vehicle_info.document_1,
    },
    vehicle_document: {
      riders_license: req.body.vehicle_document.riders_license,
      proof_of_ownership: req.body.vehicle_document.proof_of_ownership,
      cert_of_road_worthiness:
        req.body.vehicle_document.cert_of_road_worthiness,
      insurance_cert: req.body.vehicle_document.insurance_cert,
    },
  };

  // Check if any field in newVehicle is empty
  const isEmpty = Object.values(newVehicle).some((obj) =>
    Object.values(obj).some((value) => value === undefined || value === "")
  );

  if (isEmpty) {
    return res.status(400).json({
      response_code: 400,
      response_message: "Some required fields are empty",
      data: null,
    });
  }

  // Add the new vehicle to the existing list of vehicles
  riders_vehicle.vehicles.push(newVehicle);

  // Save the updated rider document with the new vehicle
  await riders_vehicle.save();

  return res.status(200).json({
    response_code: 200,
    response_message: "Successful",
    data: null,
  });
});

// ? veiw a vehicle
const riderView_a_Vehicle = asyncHandler(async (req, res) => {
  const riderId = req.user.id;
  const vehicleId = req.params.id;
  const riders_vehicle = await Rider.findOne({ _id: riderId });

  if (!riders_vehicle) {
    return res.status(404).json({
      response_code: 404,
      response_message: "Rider not found",
      data: null,
    });
  }

  // Find the vehicle with the specified ID
  const vehicle = riders_vehicle.vehicles.find(
    (v) => v._id.toString() === vehicleId
  );

  if (!vehicle) {
    return res.status(404).json({
      response_code: 404,
      response_message: "Vehicle not found",
      data: null,
    });
  }

  return res.status(200).json({
    response_code: 200,
    response_message: "Successful",
    data: vehicle,
  });
});

// ? update a vehicle
const update_a_vehicle = asyncHandler(async (req, res) => {
  const riderId = req.user.id;
  const vehicleId = req.params.id;
  const riders_vehicle = await Rider.findOne({ _id: riderId });

  if (!riders_vehicle) {
    return res.status(404).json({
      response_code: 404,
      response_message: "Rider not found",
      data: null,
    });
  }

  const vehicleIndex = riders_vehicle.vehicles.findIndex(
    (v) => v._id.toString() === vehicleId
  );

  if (vehicleIndex === -1) {
    return res.status(400).json({
      response_code: 400,
      response_message: "Vehicle not found",
      data: null,
    });
  }

  // Get the existing vehicle details
  const existingVehicle = riders_vehicle.vehicles[vehicleIndex];

  // Update only the fields provided by the frontend
  const updatedVehicle = {
    vehicle_info: {
      vehicle_type:
        req.body.vehicle_info.vehicle_type ||
        existingVehicle.vehicle_info.vehicle_type,
      brand: req.body.vehicle_info.brand || existingVehicle.vehicle_info.brand,
      model: req.body.vehicle_info.model || existingVehicle.vehicle_info.model,
      year: req.body.vehicle_info.year || existingVehicle.vehicle_info.year,
      color: req.body.vehicle_info.color || existingVehicle.vehicle_info.color,
      document_1:
        req.body.vehicle_info.document_1 ||
        existingVehicle.vehicle_info.document_1,
    },
    vehicle_document: {
      riders_license:
        req.body.vehicle_document.riders_license ||
        existingVehicle.vehicle_document.riders_license,
      proof_of_ownership:
        req.body.vehicle_document.proof_of_ownership ||
        existingVehicle.vehicle_document.proof_of_ownership,
      cert_of_road_worthiness:
        req.body.vehicle_document.cert_of_road_worthiness ||
        existingVehicle.vehicle_document.cert_of_road_worthiness,
      insurance_cert:
        req.body.vehicle_document.insurance_cert ||
        existingVehicle.vehicle_document.insurance_cert,
    },
  };

  // Update the vehicle at the specified index
  riders_vehicle.vehicles[vehicleIndex] = updatedVehicle;

  // Save the updated rider document with the modified vehicle
  await riders_vehicle.save();

  return res.status(200).json({
    response_code: 200,
    response_message: "Vehicle updated successfully",
    data: updatedVehicle,
  });
});

function isOtpExpired(expirationTime, expirationDurationInMinutes = 10) {
  const currentDateTime = new Date();
  const expirationDateTime = new Date(expirationTime);
  expirationDateTime.setMinutes(
    expirationDateTime.getMinutes() + expirationDurationInMinutes
  );
  return currentDateTime > expirationDateTime;
}

// Rider comes online
riderStatus.setRiderOnline();

// Check if a rider is online
if (riderStatus.isRiderOnline()) {
    console.log('Rider is online');
}

// Get all online riders
const onlineRiderIds = riderStatus.getOnlineRiders();



module.exports = {
  riderRegister,
  riderLogin,
  riderVerifyRegister,
  verifyRiderLogin,
  riderProfile,
  riderVehicle,
  riderAddVehicle,
  riderView_a_Vehicle,
  update_a_vehicle,
  riderStatus,
};
