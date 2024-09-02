const express = require("express");
const router = express.Router();
const {
  registerVendor,
  getAllVendors,
  getVendorsById,
  loginVendor,
  forgetPassword,
  resetPassword,
  ratingSystem,
  updateVendor,
  categorySystem,
  freeze,
  unFreeze,
  activate,
  deActivate,
  addStaff,
  vendorOrders,
} = require("../controller/vendorController");
const { passwordVerificationLimit } = require("../lib/email-sender/sender");

//register a vendor
router.get("/", getAllVendors);
router.get("/orders/:store_id/:id?", vendorOrders);
router.get("/:id", getVendorsById);
//register a vendor
router.post("/register", registerVendor);
router.post("/add/:id", addStaff);
router.put("/update/:id", updateVendor);
router.post("/category/:id", categorySystem);

router.post("/login", loginVendor);
router.put("/forget", passwordVerificationLimit, forgetPassword);
// router.put("/reset/:token", resetPassword);
router.put("/reset", resetPassword);

// ratingSystem
router.put("/rating/:vendorId", ratingSystem);

//freeze
router.put("/:id/freeze", freeze);
router.put("/:id/unfreeze", unFreeze);
router.put("/:id/activate", activate);
router.put("/:id/de-activavte", deActivate);


module.exports = router;
