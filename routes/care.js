const auth = require('../middleware/auth.js');
const {Rental, validate} = require('../models/rental'); 
const {Movie} = require('../models/movie'); 
const {Customer} = require('../models/customer'); 
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);


router.get('/',auth ,async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

// using no tranaction
// router.post('/', async (req, res) => {
//   const { error } = validate(req.body); 
//   if (error) return res.status(400).send(error.details[0].message);

//   const customer = await Customer.findById(req.body.customerId);
//   if (!customer) return res.status(400).send('Invalid customer.');

//   const movie = await Movie.findById(req.body.movieId);
//   if (!movie) return res.status(400).send('Invalid movie.');

//   if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

//   let rental = new Rental({ 
//     customer: {
//       _id: customer._id,
//       name: customer.name, 
//       phone: customer.phone
//     },
//     movie: {
//       _id: movie._id,
//       title: movie.title,
//       dailyRentalRate: movie.dailyRentalRate
//     }
//   });
//   // this approach is not fail safe because two operations of saving the rental and updating the numberInStock are done 
//  // StylePropertyMapReadOnly if one fails the db will go out of sync. we need a transaction for this. but mongodb does not have 
//  // transactions instead it has something called two phase commit. and we use a package called Fawn which simulates transactions using 
//  // two phase commit approach. see the following code in next functtion
//   rental = await rental.save();
//   movie.numberInStock--;
//   movie.save();
  
//   res.send(rental);
// });

// commit using Fawn
router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  let rental = new Rental({ 
    customer: {
      _id: customer._id,
      name: customer.name, 
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
   
 // transactions using Fawn

    // wrap the transction in try/catch block
    try {

            new Fawn.Task()
            .save('rentals', rental)    // actual name of the collection as it exists in the db with an s
            // uddate parameters : collection we want to update :id of the movie we want to update : update field of the movie
            .update('movies', {_id: movie._id }, {
              $inc: {numberInStock: -1}
            } ) 
            // also supports .delete if you need to
            //.delete
            .run();  // if run is not called none of the operations will be performed 

      res.send(rental);


    } catch (ex) 
    {
         res.status(500).send('Something Failed');
    }
    
});


router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

module.exports = router; 