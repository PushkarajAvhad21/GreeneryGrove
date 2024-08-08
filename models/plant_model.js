// const mongoose=require('mongoose')
// const TaskSchema=new mongoose.Schema({
//     upname:String,
//     name: {
//         type: String,
//         required: true,
//     },
//     url:{
//         type:String
//     },
//     price: {
//         type: Number,
//         // required: true,
//     },
//     description: String,
//     stock: String,

//     whatYouGet: {
//         pot: String,
//         plant: String,
//     },
//     quickFacts: {
//         knownAs: String,
//         growingDifficulty: String,
//         light: String,
//         water: String,
//         airPurifying: String,
//       },
// })
// module.exports=mongoose.model('Plant',TaskSchema)

// models/Plant.js
const mongoose = require('mongoose');
const Nursery=require('./nurseries.js')
const plantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantityAvailable: { type: Number, required: true },
    images: [{ type: String }],  // Assuming images are stored as URLs
    nurseries: { type: mongoose.Schema.Types.ObjectId, ref: 'Nursery' },
});

const Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;
