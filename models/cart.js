const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    itemId: { type:mongoose.Schema.Types.ObjectId,ref:"Plant" ,required: true },
    name: { type: String, required: true },
    nursery:{type:mongoose.Schema.Types.ObjectId,ref:"Nursery" ,required: true },
    
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String },
    totalPrice: { type: Number, required: true }
});

const cartSchema = new mongoose.Schema({
    userId: { type:mongoose.Schema.Types.ObjectId,ref:"User2" ,required: true  },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    items: [cartItemSchema],
    totalQuantity: { type: Number },
    totalPrice: { type: Number }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
