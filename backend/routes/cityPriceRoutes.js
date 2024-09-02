const express = require("express");
const router = express.Router();

const {
  addCityPrice,
  getCityPrices,
  getPriceById,
  getPriceByCity,
  updateCityPrice,
  deleteCity,
  deleteManyCity,
} = require("../controller/cityPriceController");

router.get("/", getCityPrices);
router.get("/:id", getPriceById);
router.get("/:city", getPriceByCity);
router.post("/", addCityPrice);
router.put("/:id", updateCityPrice);
router.delete("/:id", deleteCity);
router.patch("/delete/many", deleteManyCity);

module.exports = router;
