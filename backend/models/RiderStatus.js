const onlineRiders = {}; // Store online rider IDs

const mongoose = require('mongoose');

const Rider = mongoose.model('Rider', RiderSchema);

// Function to mark rider as online
function setRiderOnline(riderId) {
    onlineRiders[riderId] = true;
}

// Function to mark rider as offline
function setRiderOffline(riderId) {
    delete onlineRiders[riderId];
}

// Function to check if rider is online
function isRiderOnline(riderId) {
    return onlineRiders.hasOwnProperty(riderId);
}

// Function to get all online Riders (can be filtered by location later)
function getOnlineRiders() {
    return Object.keys(onlineRiders);
}

module.exports = {
    setRiderOnline,
    setRiderOffline,
    isRiderOnline,
    getOnlineRiders
};