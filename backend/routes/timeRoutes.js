const express = require("express");
const router = express.Router();
const {
  getTime,
  addTime,
  updateTime,
} = require("../controller/timeController");

router.get("/", getTime);
router.post("/", addTime);
router.put("/:id", updateTime);

module.exports = router;
