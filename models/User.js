const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    trim: true,
    required: [true, "Full name is required."]
  },
  age: {
    type: Number,
    trim: true,
    required: true,
    min: 20,
    max: 30
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"]
  },
  nin: {
    type: String,
    trim: true,
    required: true,
    unique: true // optional: ensures no duplicate NINs
  },
  phone: {
    type: String,
    trim: true,
    required: true,
    match: [/^07[0-9]{8}$/, "Phone number must start with 07 and have 10 digits"]
  },
  location: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: false,
    validate: {
      validator: (value) => value === "" || /\S+@\S+\.\S+/.test(value),
      message: "Please enter a valid email address"
    }
  },
  role: {
    type: String,
    enum: ["brooderManager", "farmer", "salesRep"],
    required: true
  },

  // Farmer-only fields
  recommenderName: {
    type: String,
    trim: true,
    required: function () {
      return this.role === 'farmer';
    }
  },
  recommenderNin: {
    type: String,
    trim: true,
    required: function () {
      return this.role === 'farmer';
    }
  },
});

// Use email or phone for login (set the field you're using in the form)
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email' // or 'phone'
});

module.exports = mongoose.model('User', userSchema);
