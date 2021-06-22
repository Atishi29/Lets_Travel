const User = require('../models/user');
const Hotel = require('../models/hotel');
const Order = require('../models/order');
const Passport = require('passport');

// express validator
const { check , validationResult} = require('express-validator/check');
const { sanitize} = require('express-validator/filter');
const querystring = require('querystring');

exports.signUpGet = ( req, res) =>{
    res.render('sign_up', { title: 'User sign up'});
}

exports.signUpPost = [
    // Validate Data
check('first_name').isLength({min: 1}).withMessage('First name must be specified')
.isAlphanumeric().withMessage('First name must be alphanumeric'),

check('surname').isLength({min: 1}).withMessage('Surname must be specified')
.isAlphanumeric().withMessage('Surname must be alphanumeric'),

check('email').isEmail().withMessage('Invalid email address'),

check('confirm_email')
.custom((value , { req }) => value === req.body.email)
.withMessage('Email address do not match'),

check('password').isLength({ min : 6})
.withMessage('Invalid password , passwords must be of atleast 6 characters'),

check('confirm_password')
.custom((value , { req }) => value === req.body.password)
.withMessage('Passwords do not match'),
sanitize('*').trim().escape(),
(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // There are errors
        //res.json(req.body)
        res.render('sign_up' , { title: 'Please fix the following errors:', errors: errors.array()});
        return;
    }
    else {
        //there are no errors
        const newUser = new User(req.body);
        User.register(newUser, req.body.password, function(err){
            if(err){
                console.log('Error while registering!', err);
                return next(err);
            }
            next(); // to be redirected to the next page when there are no errors
        });
    }
}
]
exports.loginGet = (req, res) => {
    res.render('login', { title: 'Login to continue'});
}
exports.loginPost= Passport.authenticate('local' , {
    successRedirect:'/',
    successFlash:'You are now logged in',
    failureRedirect: '/login',
    failureFlash:'Login has failed, please try again'
});
exports.logout= ( req, res) => {
    req.logout();
    req.flash('info', 'You are now logged out');
    res.redirect('/');
}
exports.bookingConfirmation = async(req, res, next) => {
    try {
        const data = req.params.data;
        const searchData= querystring.parse(data);
        const hotel = await Hotel.find( { _id: searchData.id} );
        res.render('confirmation' , { title : 'Confirm your booking', hotel, searchData});
        //res.json(searchData);

    } catch(error){
        next(error)
    }
}
exports.orderPlaced = async (req, res, next) => {
    try {
        const data = req.params.data;
        const parsedData = querystring.parse(data);
        const order = new Order({
            user_id: req.user._id,
            hotel_id: parsedData.id,
            order_details:{
                duration: parsedData.duration,
                dateOfDeparture: parsedData.dateOfDeparture,
                numberOfGuests: parsedData.numberofGuests
            }
        });
        await order.save();
        req.flash('info' , 'Thankyou , order placed');
        res.redirect('/my-account');
    } catch(error){
        next(error)
    }
}
exports.isAdmin = (req, res, next) => {
    if(req.isAuthenticated() && req.user.isAdmin) {
         next();
         return;
      }
    res.redirect('/');
}