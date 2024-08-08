const Order = require('../models/order.js');
const User = require('../models/local_auth_model'); // Adjust the path to the user model
const Cart = require('../models/cart');
const path=require('path');
const order = require('../models/order.js');

// Create a new order
// const Order = require('../models/order');
// const User = require('../models/local_auth_model'); // Adjust the path to the user model
// const Cart = require('../models/cart');
exports.showorderpage=async(req,res)=>{
    try {
        // res.render("home_local")
        // if(req.isAuthenticated()){
            // console.log("hello")
            // console.log(req.user)
            const { userId } = req.params;
            console.log(userId)
            let cartvalue=await Cart.findOne({userId:userId})
            // console.log(cartvalue)
            let itemvalue=cartvalue.items
            var totalP=0;
            var totalQ=0;
            let queryValues=req.query
            for(key in queryValues){
                console.log(queryValues[key])
                for(val of itemvalue){
                    if(key==val.name){
                        val.quantity=queryValues[key];
                        let totalp=val.price*val.quantity
                        val.totalPrice=totalp
                        totalP+=totalp
                        totalQ+=parseInt(queryValues[key])
                    }
                }
            }
            
            cartvalue.totalQuantity=totalQ
            cartvalue.totalPrice=totalP
            cartvalue.save();
            console.log(cartvalue)
            // cartvalue.save();

            res.sendFile(path.join(__dirname,"../index/checkout.html"))
        // }
        
    } catch (error) {
        console.log(error);
    }
}
exports.createOrder = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(userId)
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Find the cart by the user's cart ID
        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        // Extract items and calculate total amount
        const items = cart.items.map(item => ({
            itemId:item.itemId,
            nursery:item.nursery,
            product: item.name,
            quantity: item.quantity,
            price: item.price
        }));
        
        const totalAmount = cart.items.reduce((total, item) => total + item.totalPrice, 0);
        
        // Create a new order
        const order = new Order({
            user: userId,
            items,
            totalAmount,
            shippingAddress: req.body.shippingAddress // Assuming shippingAddress is sent in the request body
        });
        
        // Save the order
        const savedOrder = await order.save();
        
        // Clear the cart after order is placed
        cart.items = [];
        cart.totalQuantity = 0;
        cart.totalPrice = 0;
        await cart.save();
        
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
};
exports.getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ user: userId }).populate('user');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user orders', error });
    }
};
// const Order = require('../models/order');
exports.getAdminOrders = async (req, res) => {
    try {
        const { nurseryId } = req.params;
        const orders = await Order.find({ 'items.nursery': nurseryId }).lean();

        if (orders.length === 0) {
            return res.status(200).json({ message: 'No orders found for this nursery' });
        }
        for(let i=0;i<orders.length;i++){
            let val=orders[i];
            let items=val.items;
           for(let j=0;j<items.length;j++){
            if(items[j].nursery!=nurseryId){
                items.splice(j,1);
            }
           }
        }
        // Extract unique user IDs
        const userIds = [...new Set(orders.map(order => order.user.toString()))];

        // Fetch user data for these user IDs
        const users = await User.find({ _id: { $in: userIds } }).lean();

        // Create a map of user IDs to user data
        const userMap = users.reduce((acc, user) => {
            acc[user._id] = user;
            return acc;
        }, {});

        // Add userData to each order
        const ordersWithUserData = orders.map(order => {
            order.userData = userMap[order.user.toString()];
            return order;
        });

        res.status(200).send(ordersWithUserData);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Error fetching user orders', error });
    }
};
exports.updateOrder = async (req, res) => {
    try {
        const { userId } = req.params; // Use userId from params
        const updateData = req.body;

        // Find the order associated with the user
        const order = await Order.findOneAndUpdate(
            { user: userId }, // Find by userId
            updateData,
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found for the specified user' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error });
    }
};
exports.deleteOrder = async (req, res) => {
    try {
        const { userId } = req.params;

        const order = await Order.findOneAndDelete(
            { user: userId }, // Find by userId
        );
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error });
    }
};
exports.getCustomer=async(req,res)=>{
    try {
        const { nurseryId } = req.params;
        const orders = await Order.find({ 'items.nursery': nurseryId }).lean();

        if (orders.length === 0) {
            return res.status(200).json({ message: 'No orders found for this nursery' });
        }

        // Extract unique user IDs
        const userIds = [...new Set(orders.map(order => order.user.toString()))];

        // Fetch user data for these user IDs
        const users = await User.find({ _id: { $in: userIds } }).lean();

        // Create a map of user IDs to user data
        const userMap = users.reduce((acc, user) => {
            acc[user._id] = user;
            return acc;
        }, {});

       

        res.status(200).send(userMap);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Error fetching user orders', error });
    }
}
