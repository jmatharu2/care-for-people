const Joi = require('joi');
const moment = require('moment');
// use this for validating objectIds

const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  customer: { 
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      isGold: {
        type: Boolean,
        default: false
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      }      
    }),  
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 255
      },
      dailyRentalRate: { 
        type: Number, 
        required: true,
        min: 0,
        max: 255
      }   
    }),
    required: true
  },
  dateOut: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  dateReturned: { 
    type: Date
  },
  rentalFee: { 
    type: Number, 
    min: 0
  }
});

// we can add a static method to the rental schema as follws
// because we are using this we cannot use the arrow syntax 
rentalSchema.statics.lookup = function(customerId, movieId) {
     return   this.findOne({
    'customer._id': customerId,
    'movie._id': movieId
});

}

rentalSchema.methods.return = function () {
    this.dateReturned = new Date();

    const rentalDays = moment().diff(this.dateOut, 'days');
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}
const Rental = mongoose.model('Rental', rentalSchema);

// function validateRental(rental) {
//   const schema = Joi.object( {
//     customerId: Joi.objectId(),
//     movieId: Joi.objectId
//   });

//   return schema.validate(rental);
// }

function validateRental(rental) {
const schema = Joi.object({
customerId: Joi.objectId(),
movieId: Joi.objectId()
});
return schema.validate(rental);
}



exports.Rental = Rental; 
exports.validate = validateRental;