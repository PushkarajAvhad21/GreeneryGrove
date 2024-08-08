// controllers/nurseryController.js
const express=require('express')
const app=express()
const Nursery = require('../models/nurseries.js');
const Plant=require("../models/plant_model")
const ADMIN=require("../models/google_admin")
const path=require('path')

// Controller function to create a new nursery
const createNursery = async (req, res) => {
    try {
        const {
            name,
            location,
            'contactInformation[phoneNumber]': phoneNumber,
            'contactInformation[emailAddress]': emailAddress,
            'contactInformation[website]': website,
            description,
            openingHours
        } = req.body;
        
        // Get admin ID from request parameters
        const ownerManager = req.params.adminId;
        const newNursery = new Nursery({
            name,
            location,
            contactInformation: { phoneNumber, emailAddress, website },
            description,
            openingHours,
            ownerManager
        });

        // Save nursery to database
        const savedNursery = await newNursery.save();
        let admin_doc = await ADMIN.findByIdAndUpdate(ownerManager, { nursery: savedNursery.id }, { new: true });

        // Create new nursery instance
        res.redirect("http://localhost:3000");
        // res.status(201).json(savedNursery);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


const insertOne = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            quantityAvailable,
            images
              // Assuming nurseryId is passed in req.body or req.params
        } = req.body;
        let nurseryId=req.params.nurseryId;
        
        // Create a new plant instance
        const newPlant = new Plant({
            name,
            description,
            price,
            quantityAvailable,
            images,
            nurseries: nurseryId  // Associate plant with a nursery using nurseryId
        });
        
        // Save the new plant to the database
        const savedPlant = await newPlant.save();
        const nursery_doc=await Nursery.findByIdAndUpdate(nurseryId,{$push:{plants:savedPlant.id}},{new:true});
        // let plant_value=nursery_doc.plants
        // plant_value.push(savedPlant.id);
        res.status(201).json(savedPlant);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};
const getAll = async (req, res) => {
    try {
        const nurseryId = req.params.nurseryId;
        const nursery = await Nursery.findById(nurseryId);
        if (!nursery) {
            return res.status(404).json({ message: 'Nursery not found' });
        }
        const plants = await Plant.find({ nurseries: nurseryId });

        res.status(200).json({
            nursery_name: nursery.name,
            plants: plants
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
const viewall=async(req,res)=>{
    try {
        if(req.isAuthenticated()){
            // app.use(express.static(__dirname+'/index'))
            res.sendFile(path.join(__dirname,"../index/dashboard.html"))
        }
        else{
            res.redirect("/login")
        }
    } catch (error) {
        console.log(error)
    }
}
const takenurseryinput=async(req,res)=>{
    try {
        if(req.isAuthenticated()){
            // app.use(express.static(__dirname+'/index'))
            res.sendFile(path.join(__dirname,"../index/takenurseryinput.html"))
        }
        else{
            res.redirect("/login")
        }
    } catch (error) {
        console.log(error)
    }
}
module.exports={createNursery,insertOne,getAll,viewall,takenurseryinput}