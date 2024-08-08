const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User2',
        required: true
    },
    // nursery:{type:mongoose.Schema.Types.ObjectId,ref:"Nursery"  },
    items: [{
        itemId:{
            type:mongoose.Schema.Types.ObjectId,ref:"Plant"
        },
        nursery:{type:mongoose.Schema.Types.ObjectId,ref:"Nursery"  },
        product: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    shippingAddress: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

OrderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Order', OrderSchema);
