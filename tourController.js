//const fs = require('fs');
const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
// const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {         // pre-filling the query stack with the help of midddleware when user write top-5-cheap(user don't have to write query);
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};
/*
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        //console.log(req.query, queryObj);

        // 1b) Advanced filtering
        let queryStr = JSON.stringify(queryObj);    // convert Obj to string
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        // console.log(JSON.parse(queryStr));

        // {difficulty: 'easy', duration: {$gte: 5} }
        // { duration: { gte: '5' }, difficulty: 'easy' }
        // gte, gt, lte, lt

        this.query = this.query.find(JSON.parse(queryStr))
        // let query = Tour.find(JSON.parse(queryStr));

        return this;         //so that we can call other methods upon execution of query
    }


    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            //console.log(sortBy);
            this.query = this.query.sort(sortBy);
            //sort('price ratingsAverage')
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');    //with minus we are excluding this fields
        }

        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
        // page=2&limit=10 , 1-10 page1, 11-20 page 2, 21-30 page 3 and so on..
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}
*/
/*const tours = JSON.parse
(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);*/

/*exports.checkID = (req, res, next, val) =>{
    console.log(`Tour id is: ${val}`);
    if(req.params.id * 1 > tours.length){     //Now we will use id that are are coming from mongodB itself.
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    next();
};
*/
/*
exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price'
        })
    }
    next();
};
*/

exports.getAllTours = factory.getAll(Tour);
// exports.getAllTours = catchAsync(async (req, res, next) => {

//     // EXECUTE QUERY
//     const features = new APIFeatures(Tour.find(), req.query)   //We create a query using find and we chain all methods to it.
//         .filter()
//         .sort()
//         .limitFields()
//         .paginate();
//     const tours = await features.query;    //execute query, but before this pre find middleware executed.

//     //SEND RESPONSE
//     res.status(200).json({
//         status: 'success',
//         results: tours.length,
//         data: {
//             tours
//         }
//     });
// });

/*
exports.getAllTours = async (req, res) => {
    try {
        //console.log(req.query);
        // BUILD QUERY
        // 1a) Filtering
        /*
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        //console.log(req.query, queryObj);

        // 1b) Advanced filtering
        let queryStr = JSON.stringify(queryObj);    // convert Obj to string
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        // console.log(JSON.parse(queryStr));

        // {difficulty: 'easy', duration: {$gte: 5} }
        // { duration: { gte: '5' }, difficulty: 'easy' }
        // gte, gt, lte, lt

        let query = Tour.find(JSON.parse(queryStr));
        */

// 2) Sorting
/*
if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    //console.log(sortBy);
    query = query.sort(sortBy);
    //sort('price ratingsAverage')
} else {
    query = query.sort('-createdAt');
}
*/

// 3) Field limiting
/*
if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
} else {
    query = query.select('-__v');    //with minus we are excluding this fields
}
*/

// 4) Pagination
/*
const page = req.query.page * 1 || 1;
const limit = req.query.limit * 1 || 100;
const skip = (page - 1) * limit;
// page=2&limit=10 , 1-10 page1, 11-20 page 2, 21-30 page 3 and so on..
query = query.skip(skip).limit(limit);

if (req.query.page) {
    const numTours = await Tour.countDocuments();
    if (skip >= numTours) throw new Error('This page does not exist');        //throwing error here immedietly go to catch block and throw 404 error
}
*/

/*const tours = await Tour.find({
duration: 5,
difficulty: 'easy'
 
});*/
/* const query = Tour.find()
 .where('duration')
 .equals(5)
 .where('difficulty')
 .equals('easy');*/

//console.log(req.requestTime);
/* commenting whole getAlltours func
        // EXECUTE QUERY
        const features = new APIFeatures(Tour.find(), req.query)   //We create a query using find and we chain all methods to it.
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const tours = await features.query;    //execute query, but before this pre find middleware executed.
        //const tours = await query;


        //SEND RESPONSE
        res.status(200).json({
            status: 'success',
            //requestedAt: req.requestTime,
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};
*/

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

// exports.getTour = catchAsync(async (req, res, next) => {      //: used to define id variable
//     // const tour = await Tour.findById(req.params.id, err => {
//     const tour = await Tour.findById(req.params.id).populate('reviews');
//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     });
// });

/*
exports.getTour = async (req, res) => {      //: used to define id variable
    try {
        const tour = await Tour.findById(req.params.id);        //In mongoose
        // Tour.findOne({_id: req.params.id})                //this will also works well
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
    //console.log(req.params);     //req.params assign value to the variable we define(id)
    //const id = req.params.id * 1;   //convert string into number as before id is in string in json
    //const tour = tours.find(el => el.id === id)

    //if(id > tours.length){
    /* if(!tour){
     return res.status(404).json({
         status: 'fail',
         message: 'Invalid ID'
     });
 }*/

/*res.status(200).json({
    status: 'success',
    data: {
        tour
   }
});  
};
*/

/*const catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
*/

exports.createTour = factory.createOne(Tour);
// exports.createTour = catchAsync(async (req, res, next) => {
//     const newTour = await Tour.create(req.body);
//     res.status(201).json({
//         status: 'success',
//         data: {
//             tour: newTour
//         }
//     });
// });
/*
exports.createTour = async (req, res) => {
    try {
        // const newTours = new Tour({})
        //newTours.save();

        const newTour = await Tour.create(req.body);

        // console.log(req.body);

        /*const newId = tours[tours.length -1].id + 1;
        const newTour = Object.assign({id: newId}, req.body);   //creating new object by merging two existing object
     
        tours.push(newTour);
        fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err =>{ */
/*            
res.status(201).json({
    status: 'success',
    data: {
        tour: newTour
    }
});
    } catch (err) {
    res.status(404).json({
        status: 'fail',
        message: err
    });
}
    //});
    // res.send('Done');
};
*/

exports.updateTour = factory.updateOne(Tour);

// exports.updateTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true
//     }, err => {
//         if (err) {
//             return next(new AppError('No tour found with that ID', 404));
//         }
//     });
//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     });
// });

/*
exports.updateTour = async (req, res) => {
    /* if(req.params.id * 1 > tours.length){
            return res.status(404).json({
                status: 'fail',
                message: 'Invalid ID'
            });
        }
     */
/*
try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
} catch (err) {
    res.status(404).json({
        status: 'fail',
        message: err
    });
}
};
*/

exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndDelete(req.params.id, err => {
//         if (err) {
//             return next(new AppError('No tour found with that ID', 404));
//         }
//         res.status(204).json({
//             status: 'success',
//             data: null
//         });
//     });
// });

/*
exports.deleteTour = async (req, res) => {
    /* if(req.params.id * 1 > tours.length){
            return res.status(404).json({
                status: 'fail',
                message: 'Invalid ID'
            });
        }*/
/*
try {
await Tour.findByIdAndDelete(req.params.id);
res.status(204).json({
    status: 'success',
    data: null
});
} catch (err) {
res.status(404).json({
    status: 'fail',
    message: err
});
};
};
*/

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            }
        },
        {
            $sort: { avgPrice: 1 }
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});

/*
exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    // _id: '$difficulty',
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                }
            },
            {
                $sort: { avgPrice: 1 }
            },
            /* {
                 $match: { _id: { $ne: 'EASY' } }
             }*/
/*
]);

res.status(200).json({
status: 'success',
data: {
   stats
}
});
} catch (err) {
res.status(404).json({
status: 'fail',
message: err
});
}
}
*/

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {     /// making documents for each dates
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },        //extracting month from date
                numTourStarts: { $sum: 1 },             // counting tours in each month
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { numTourStarts: -1 }
        },
        {
            $limit: 12
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    });
});

/*
exports.getMonthlyPlan = async (req, res) => {     /// making documents for each dates
    try {
        const year = req.params.year * 1;

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },        //extracting month from date
                    numTourStarts: { $sum: 1 },             // counting tours in each month
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numTourStarts: -1 }
            },
            {
                $limit: 12
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}
*/

// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) {
        next(new AppError('Please provide latitude and longitude in the format lat,lng.',
            400
        )
        );
    }
    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours
        }
    });
});

exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;           //convert distance into miles or km based on unit

    if (!lat || !lng) {
        next(new AppError('Please provide latitude and longitude in the format lat,lng.',
            400
        )
        );
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            data: distances
        }
    });
})