const Plant=require("../models/plant_model")
const path=require('path')
const nursery =require('../models/nurseries.js')
const USER=require('../models/google_admin.js')
//to load view all page
const viewall=async(req,res)=>{
    try {
        if(req.isAuthenticated()){

            res.sendFile(path.join(__dirname,"../index/viewall.html"))
        }
        else{
            res.redirect("/login")
        }
    } catch (error) {
        console.log(error)
    }
}
//to load productdetail page
const viewone=async(req,res)=>{
    try {
        if(req.isAuthenticated()){

            res.sendFile(path.join(__dirname,"../index/productdetaill.html"))
        }
        else{
            res.redirect("/login")
        }
    } catch (error) {
        console.log(error)
    }
}
const getAll=async(req,res)=>{
    try {
        const task1=await Plant.find();
        res.status(200).json(task1);
    } catch (error) {
        console.log(error)
    }
    
}
const sort=async(req,res)=>{
    try {
        
        const data3=await Plant.find().sort({price:-1})
        console.log(data3)
    } catch (error) {
        console.log(error)
    }
}
const revsort=async(req,res)=>{
    try {
        
        const data4=await Plant.find().sort({price:1})
        console.log(data4)
    } catch (error) {
        console.log(error)
    }
}
const getOne=async(req,res)=>{
    try {
       
        const data5=await Plant.findOne(req.query.plantId)
        res.status(200).json(data5)
    } catch (error) {
        console.log(error)
    }
}
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
        // const nurseryId=req.params.nurseryId;
        const userId=req.user.id;
        console.log(userId)
        const userVal=await USER.findOne({_id:userId})
        const nurseryId=userVal.nursery;
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
        const nurseryDoc = await nursery.findByIdAndUpdate(
            nurseryId,
            { $push: { plants: savedPlant._id } }, // Add the plant ID to the plants array
            { new: true, useFindAndModify: false }
        );
        res.status(201).json(savedPlant);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

const deleteOne=async(req,res)=>{
    try {
        const data2={
            name:req.body.name
        }
        const task3=await Plant.findOneAndDelete(data2)
        console.log("deleted successfully")
    } catch (error) {
        console.log(error)
    }
}

const updateOne=async(req,res)=>{
    try {
        const data10 = {
            name: req.body.name,
            url: req.body.url,
            price: req.body.price,
            description: req.body.description,
            stock: req.body.stock,
            whatYouGet: {
                pot: req.body['whatYouGet.pot'], // Use square brackets
                plant: req.body['whatYouGet.plant'] // Use square brackets
            },
            quickFacts: {
                knownAs: req.body['quickFacts.knownAs'],
                growingDifficulty: req.body['quickFacts.growingDifficulty'],
                light: req.body['quickFacts.light'],
                water: req.body['quickFacts.water'],
                airPurifying: req.body['quickFacts.airPurifying']
            }
        };
        const obj={
            name:req.body.name
        }
        const task10=await Plant.findOneAndUpdate(obj,data10,{
            new:true,
            runValidators: true,
        })
        res.status(200).json(task10)        
    } catch (error) {
        console.log(error)
    }
}
module.exports={getAll,insertOne,deleteOne,sort,revsort,getOne,viewall,viewone,updateOne}