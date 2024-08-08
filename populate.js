require('dotenv').config()
const plant_schema=require('./models/plant_model.js')
const connectDB=require('./db/connect.js')
const plants=require('./plant_data.json')

const start=async(req,res)=>{
    try {
        await connectDB(process.env.MONGO_URI)
        await plant_schema.deleteMany()
        
        await plant_schema.create(plants)
        console.log("success!!!")
        process.exit(0)
        
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
start()
// console.log(internships);