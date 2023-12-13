const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    email: {
      type: String,
      unique: true,
      minlength: 5,
      maxlength: 255
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024
    },
    isAdmin: Boolean
  });
  
  userSchema.methods.generateAuthToken = function () {
    // change user._id to this._id , store the isAdmin property as part ot the jwt body so it can be retrived later from jwt
   const  token = jwt.sign({_id: this._id, isAdmin: this.isAdmin }, config.get('JwtPrivateKey'));
    return token;
  };

const User = mongoose.model('User', userSchema );

function validateUsers(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required()
  };

  return Joi.validate(user, schema);
}

exports.User = User; 
exports.validate = validateUsers;