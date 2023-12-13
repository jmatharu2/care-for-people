const auth = require('../middleware/auth.js');
const _ = require('lodash');
const {User, validate} = require('../models/users'); 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.get('/me',auth ,async (req, res) => {
    // get the id of the user from middleware
    // find the user in the database
    // exclude the password 
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
    
});

router.post('/',auth ,async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

 // to enforce password complexity you can use joipasswordcomplexity package.
 // use bcrypt for password hashing 

  let user = await User.findOne({email: req.body.email});
  if(user) return res.status(400).send('User Already registered ...')

  user = new User( _.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  
  await user.save();
  // return back jwt token back to user in the header.
  //token = jwt.sign({_id: user._id}, config.get('JwtPrivateKey'));
  //move token generation to a common place inside users model which is the centeral place for user related stuff
  const token = user.generateAuthToken();
                     
  res.header('x-auth-token', token).send( _.pick(user, ['_id', 'name', 'email']));

  //res.send(user);
});

router.put('/:id',auth ,async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(req.params.id,
    { 
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }, { new: true });

  if (!user) return res.status(404).send('The Users with the given ID was not found.');
  
  res.send(user);
});

router.delete('/:id',auth ,async (req, res) => {
  const users = await User.findByIdAndRemove(req.params.id);

  if (!user) return res.status(404).send('The Users with the given ID was not found.');

  res.send(user);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).send('The Users with the given ID was not found.');

  res.send(user);
});

module.exports = router; 