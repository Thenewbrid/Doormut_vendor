const express = require("express");
const CityPrice = require("../models/CityPrices");

const addCityPrice = async (req, res) => {
  try {
    const cityPrice = new CityPrice(req.body);
    await cityPrice.save();
    res.status(201).send({ message: "City Price added sucessfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

const getCityPrices = async (req, res) => {
  const searchQuery = req.query.search;
  try {
    const cityPrices = await CityPrice.find({}).sort({ _id: -1 });
    let filteredCities = cityPrices;
    if (searchQuery) {
      filteredCities = filteredCities.filter((cities) => {
        return cities.city
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });
    }
    res.send(filteredCities);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const getPriceByCity = async (req, res) => {
  try {
    const cityPrice = await CityPrice.find({ _id: req.body.id });
    if (!cityPrice) {
      res.status(404).send({ message: "City not found" });
    } else {
      res.send(cityPrice);
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

const getPriceById = async (req, res) => {
  try {
    const cityPrice = await CityPrice.findById({ _id: req.params.id });
    if (!cityPrice) {
      res.status(404).send({ message: "City not found" });
    } else {
      res.send(cityPrice);
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

const updateCityPrice = async (req, res) => {
  try {
    const cityPrice = await CityPrice.findById({ _id: req.params.id }).exec();
    if (!cityPrice) {
      res.status(404).send({ message: "City not found" });
    } else {
      cityPrice.city = req.body.city;
      cityPrice.pricePerKM = req.body.pricePerKM;
      cityPrice.serviceCharge = req.body.serviceCharge;
      await cityPrice.save();
      res.send({ message: "City price updated sucessfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const deleteCity = async (req, res) => {
  try {
    await CityPrice.findOneAndRemove({ _id: req.params.id }).exec();
    res.status(204).send({ message: "City deleted sucessfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

const deleteManyCity = async (req, res) => {
  try {
    await CityPrice.deleteMany({ _id: req.body.ids });
    res.status(204).send({ message: "Cities deleted sucessfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  addCityPrice,
  getCityPrices,
  getPriceByCity,
  getPriceById,
  updateCityPrice,
  deleteCity,
  deleteManyCity,
};
