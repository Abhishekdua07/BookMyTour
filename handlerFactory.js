const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
});

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

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }, err => {
        if (err) {
            return next(new AppError('No document found with that ID', 404));
        }
    });
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});



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

exports.createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});

// exports.createTour = catchAsync(async (req, res, next) => {
//     const newTour = await Tour.create(req.body);
//     res.status(201).json({
//         status: 'success',
//         data: {
//             tour: newTour
//         }
//     });
// });


exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {      //: used to define id variable
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});

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

exports.getAll = Model =>
    catchAsync(async (req, res, next) => {
        //To allow for nested GET reviews on tour (hack)
        let filter = {};
        if (req.params.tourId) filter = { tour: req.params.tourId };
        // EXECUTE QUERY
        const features = new APIFeatures(Model.find(filter), req.query)   //We create a query using find and we chain all methods to it.
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const doc = await features.query;    //execute query, but before this pre find middleware executed.
        // const doc = await features.query.explain();    //execute query, but before this pre find middleware executed.

        //SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                data: doc
            }
        });
    });

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