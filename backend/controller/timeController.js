const Time = require("../models/Time");
const mongoose = require("mongoose");

const getTime = async (req, res) => {
  try {
    const time = await Time.find({});
    res.status(200).json(time);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addTime = async (req, res) => {
  try {
    const time = await Time.create(req.body);
    res.status(200).json(time);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTime = async (req, res) => {
  try {
    const { id } = req.params;
    const time = await Time.findByIdAndUpdate(id, req.body);
    if (!time) {
      return res.status(404).json({ message: error.message });
    }
    const updatedTime = await Time.findById(id);
    res.status(200).json(updatedTime);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTime,
  addTime,
  updateTime
};
