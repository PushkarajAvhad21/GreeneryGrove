const Cart = require('../models/cart');
const Plant = require('../models/plant_model');
const mongoose = require('mongoose');
const user = require('../models/local_auth_model');
const path=require('path')

exports.addItemToCart = async (req, res) => {
    const { userId } = req.params;
    var plantId = req.query.plantId; // Remove quotes from plantId
    const quantity = parseInt(req.query.quantity); // Remove quotes and parse quantity
    // plantId=parseInt(plantId);
    plantId=new mongoose.Types.ObjectId(plantId)
    console.log(plantId)
    try {
        // Retrieve the plant document
        const PLANT = await Plant.findById(plantId);
        console.log(PLANT)
        if (!PLANT) {
            return res.status(404).json({ message: 'Plant not found' });
        }

        // Create the item object
        const newItem = {
            itemId: PLANT.id,
            name: PLANT.name,
            nursery: PLANT.nurseries,
            price: PLANT.price,
            quantity:quantity,
            image: PLANT.images[0],
            totalPrice: PLANT.price * quantity
        };
        // console.log(newItem)
        // Find or create the cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [], totalQuantity: 0, totalPrice: 0 });
        }

        // Check if the plant is already in the cart
        const existingItem = cart.items.find(item => item.itemId.equals(PLANT._id));
        if (existingItem) {
            // Update existing item
            existingItem.quantity += quantity;
            existingItem.totalPrice = existingItem.price * existingItem.quantity;
        } else {
            // Add new item
            cart.items.push(newItem);
        }

        // Calculate totals
        cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
        cart.updatedAt = Date.now();

        await cart.save();
        var user_doc=await user.findById(userId)
        console.log(user_doc);
        console.log(cart.id)
        user_doc.cart=cart.id
       await user_doc.save()
       res.redirect(`https://greenerygrove.onrender.com/cart/${userId}`)
    //    res.json({ message: 'Item added to cart successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getCart = async (req, res) => {
    const { userId } = req.params;

    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //     return res.status(400).json({ message: 'Invalid user ID' });
    // }

    try {
        let cart = await Cart.findOne({ userId })
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.removeItemFromCart = async (req, res) => {
    const { userId } = req.params;
    const plantId = req.params.plantId; // Remove quotes from plantId

    // if (!mongoose.Types.ObjectId.isValid(plantId) || !mongoose.Types.ObjectId.isValid(userId)) {
    //     return res.status(400).json({ message: 'Invalid ID format' });
    // }

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        console.log(userId)
        // Remove item from cart
        cart.items = cart.items.filter(item => !item.itemId.equals(plantId));
        cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
        cart.updatedAt = Date.now();

        await cart.save();
        // res.redirect(`http://localhost:3000/cart/${userId}`)
        // console.log(cart)
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.showcart=async(req,res)=>{
    try {
        // res.render("home_local")
        // if(req.isAuthenticated()){
            // console.log("hello")
            // console.log(req.user)
            res.sendFile(path.join(__dirname,"../index/order.html"))
        // }
        
    } catch (error) {
        console.log(error);
    }
}
