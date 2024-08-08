const mongoose = require('mongoose');
const admin=require('./google_admin.js')
const Plant=require('./plant_model.js')
const nurserySchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    contactInformation: {
        phoneNumber: { type: String },
        emailAddress: { type: String },
        website: { type: String }
    },
    description: { type: String },
    openingHours: { type: String },
    ownerManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Admin_login'
    },
    plants:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Plant'
    }]

});

const Nursery = mongoose.model('Nursery', nurserySchema);

module.exports = Nursery;