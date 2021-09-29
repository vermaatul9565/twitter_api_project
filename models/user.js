const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  
    name:{
        type: String,
        required: [true, 'Please enter your name'],
    },
    email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter password'],
    minlength: [8, 'Minimum password length is 8 characters'],
  }
});

// hash password before save to db
userSchema.pre('save',async function (next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


const User = mongoose.model('user', userSchema);
module.exports = User;