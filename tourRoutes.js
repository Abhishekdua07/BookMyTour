const express = require('express');
const userController = require('./../controllers/userController');
const tourController = require('./../controllers/tourController')
const authController = require('./../controllers/authController');
// const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./../routes/reviewRoutes');
//const fs = require('fs');

/*const tours = JSON.parse
(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) =>{
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours    
        }
    });
};

const getTour = (req, res) =>{      //: used to define id variable
    console.log(req.params);     //req.params assign value to the variable we define(id)
    const id = req.params.id * 1;   //convert string into number as before id is in string in json
    const tour = tours.find(el => el.id === id)

    //if(id > tours.length){
        if(!tour){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
       }
    });
};

const createTour = (req, res)=>{
    // console.log(req.body);
 
     const newId = tours[tours.length -1].id + 1;
     const newTour = Object.assign({id: newId}, req.body);   //creating new object by merging two existing object
 
     tours.push(newTour);
     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err =>{
         res.status(201).json({
             status: 'success',
             data: {
                 tour: newTour
             }
         });
     });
    // res.send('Done');
 };

const updateTour = (req, res)=>{
    if(req.params.id * 1 > tours.length){
           return res.status(404).json({
               status: 'fail',
               message: 'Invalid ID'
           });
       }
   
   res.status(200).json({
       status: 'success',
       data: {
           tour: '<Updated tour here...>'
       }
   });
};

const deleteTour =  (req, res)=>{
    if(req.params.id * 1 > tours.length){
           return res.status(404).json({
               status: 'fail',
               message: 'Invalid ID'
           });
       }
   
   res.status(204).json({
       status: 'success',
       data: null
   });
};*/

const router = express.Router();

//router.param('id', tourController.checkID);
//console.log(`Tour id is: ${val}`);
// next();
//});

// router.route('/:tourId/reviews').post(authController.protect, authController.restrictTo('user'),
//     reviewController.createReview);

router.use('/:tourId/reviews', reviewRouter);

router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours)       //tourController.aliasTopTours  this middleware func fills the query stack first and then tourController.getAllTours func calls. (that's the power of middleware) 

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'), tourController.getMonthlyPlan);

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin)   //distance = radius within we want  to search tour, latlang = latitude and longitude of user location
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
    .route('/')
    .get(tourController.getAllTours)
    //.post(tourController.createTour);
    .post(authController.protect, authController.restrictTo('admin', 'lead-guide'),
        tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(
        authController.protect,                  //protect middleware
        authController.restrictTo('admin', 'lead-guide'),
        tourController.updateTour)
    .delete(authController.protect,                  //protect middleware
        authController.restrictTo('admin', 'lead-guide'),   //restrictTo middleware
        tourController.deleteTour);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
