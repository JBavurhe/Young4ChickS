const mongoose = require('mongoose');

const chickSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },

    
    quantity:{
        type: Number,
        required: true
    },

    chickType:{
        type: String,
        required: true
    },

    breed:{
        type: String,
        required: true
    },

    requestDate:{
        type: Date,
        required: true
    },

    farmerType:{
        type: String,
        required: true,
        enum: ["starter", "returning"],
    },

    unitPrice:{
        type:Number
    },

    notes:{
        type: String
    },

    status :{
        type: String,
        enum: ["pending", "approved", "dispatched", "canceled"],
        default: "pending"
    },   //changes the status according to manager

    lastTakenDate : Date

});
module.exports = mongoose.model('chickRequests', chickSchema); //name tht appears in db