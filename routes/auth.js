const bcrypt = require('bcrypt');
const _ = require('lodash');
const Joi = require('joi');
const {User} = require('../models/users'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid Email address or password ');

    const validPassword =  await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid Email address or password ');
    // npm i jsonwebtoken 
    // private key should be stored in environment variable
    //const token = jwt.sign({_id: user._id}, 'jwtPrivatekey');
    // install config module for storing secrets in environment variables 
    // npm i config 
    // moved token generation to users model
    //const token = jwt.sign({_id: user._id}, config.get('JwtPrivateKey'));

    const token = user.generateAuthToken();
    res.send(token);

  });

  function validate(req) {
    const schema = {
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(1024).required()
    };
  
    return Joi.validate(req, schema);
  }

  module.exports = router; 