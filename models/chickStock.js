const mongoose = require('mongoose');
const chickStockSchema = new mongoose.Schema({
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

    stockDate:{
        type: Date,
        required: true
    },

    age:{
        type: Number,
        required: true
    }


});
module.exports = mongoose.model('chickStock', chickStockSchema);