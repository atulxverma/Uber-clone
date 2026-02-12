const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"],
    },
    lastname: {
         type: String,
            minlength: [3, "Last name must be at least 3 characters long"],
    }
  },
  email : {
    type : String,
    required : true,
    unique : true,
    match : [/\S+@\S+\.\S+/, 'Please use a valid email address.'],
    minlength: [5, "Email must be at least 5 characters long"],
    },
    password : {
        type : String,
        required : true,
        select : false,
        minlength: [6, "Password must be at least 6 characters long"],
    },

    socketId : {
        type : String,
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

userSchema.statics.hashPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel; 
