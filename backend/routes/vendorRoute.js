const express = require("express");
const router = express.Router();
const {
  registerVendor,
  getAllVendors,
  getVendorsById,
  getVendorsByStoreId,
  loginVendor,
  updateVendorlogin,
  updateVendorAddress,
  deleteVendor,
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
  updateStaff,
  deleteStaff,
  getAllStaffs,
  findStaffById,
  vendorOrders,
  verify,
  unverify,
} = require("../controller/vendorController");
const { passwordVerificationLimit } = require("../lib/email-sender/sender");
const { isAuth, isAdmin } = require("../config/auth");

//register a vendor
router.get("/", getAllVendors);
router.get("/orders/:store_id/:id?", isAuth, vendorOrders);
router.get("/:id", getVendorsById);
router.get("/store/:store_id", getVendorsByStoreId);
router.get("/staffs/:id", isAuth, getAllStaffs);
router.get("/staffs/:id/:staffId", findStaffById);

//register a vendor
router.post("/register", registerVendor);
router.post("/add/:id", addStaff);
router.post("/category/:id", categorySystem);

router.post("/login", loginVendor);
router.put("/forget", passwordVerificationLimit, forgetPassword);
// router.put("/reset/:token", resetPassword);
router.put("/reset", resetPassword);
router.put("/update/:id", updateVendor);
router.put("/staffs/:id/:staffId", updateStaff);
router.put("/update-login/:id", updateVendorlogin);
router.put("/update-address/:id", updateVendorAddress);

// ratingSystem
router.put("/rating/:vendorId", ratingSystem);

//freeze
router.put("/:store_id/freeze", freeze);
router.put("/:store_id/unfreeze", unFreeze);
router.put("/:store_id/activate", activate);
router.put("/:store_id/de-activavte", deActivate);
router.put("/:store_id/verify", verify);
router.put("/:store_id/unverify", unverify);

// /delete
router.delete("/:id", deleteVendor);
router.delete("/staffs/:id/:staffId", deleteStaff);

module.exports = router;
