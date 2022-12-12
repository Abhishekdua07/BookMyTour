const mongoose = require('mongoose');
const slugify = require('slugify');    //we install it (npm i slugify)
const validator = require('validator');  //we install it
// const User = require('./userModel')         // this is for embedding, we don't need for referencing, it will automatically work.
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour must have less or equal then 40 characters'],
        minlength: [10, 'A tour must have more or equal then 10 characters'],
        //validate: [validator.isAlpha, 'Tour name must only contain characters']  //With spaces too, it gives error
    },
    slug: String,             //for working slugify
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {      //This is only for strings
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10   // 4.66667 , 4.7
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {           // Custom Validators
                // this only points to current doc on NEW document creation
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price'
        }
    },
    summary: {
        type: String,
        trim: true,        //e.g (  akndj  ld  ) it will remove extra spaces.
        required: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],    //we want string but in array
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false            //did not shown to clients/hiding
    },
    startDates: [Date],
    secretTour: {                  //this object is for schema type
        type: Boolean,
        default: false
    },
    startLocation: {              // but this object is actually embedded object.
        //GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']          //with enum we can specify only property this object can take.Here it can takes only Point.
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    // guides: Array                //this was for embedding

    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'                    //this is how we develop references between different dataset in mongooose
        }
    ]
    // reviews: [
    //     {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Review'
    //     } 
    // ]
},
    {
        toJSON: { virtuals: true },      //without this we can not see virtual property defined below
        toObject: { virtuals: true }      //when data gets outputed as an object
    });
tourSchema.index({ slug: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });   //prices are ordered in this index  (+1 means ascending, -1 =>descending). Now MongoDB engine will not check from all documents to give us query result.
// tourSchema.index({ price: 1 });   //prices are ordered in this index  (+1 means ascending, -1 =>descending). Now MongoDB engine will not check from all documents to give us query result.
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {       // we are not using err funct becoz then we can not use this keyword so we use regular funct.
    return this.duration / 7;                               // We can not use this as a query because this property is not the part of database.
});

//Virtual Populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});

tourSchema.pre('save', function (next) {               //Just like express middlewares, we also have mongoose middlewares. Here we are using pre middleware that runs before save a document to the data base or create a document.
    this.slug = slugify(this.name, { lower: true });
    next();        //if we don't use next func then request will stuck and will not give output
});

// //By Embedding
// tourSchema.pre('save', async function (next) {
//     const guidesPromises = this.guides.map(async id => await User.findById(id));          //asynchronous function returns promise, so guidesPromises contain array of promises 
//     this.guides = await Promise.all(guidesPromises);           //guidesPromises will run by awaiting promise.all
// });

/*tourSchema.pre('save', function (next) {
    console.log('Will save document...');
    next();
})

tourSchema.post('save', function (doc, next) {            //post middleware function executes after all middlewares
    console.log(doc);
    next();
})
*/

//Query Middleware : runs before executing query
tourSchema.pre(/^find/, function (next) {               //run for any command that start with find e.g find, findOne, findAndDelete
    //tourSchema.pre('find', function (next) {
    this.find({ secretTour: { $ne: true } })                 //where secretTour property is false, it will output that data.

    this.start = Date.now();
    next();                                                  //because we don't want to share secret tour details in public
});

/*tourSchema.pre('findOne', function (next) {            //No need of these because we used /^find/
    this.find({ secretTour: { $ne: true } })                 //without pre findone, we are able to get secret tour data by using its id.
    next();                                                 
});
*/

tourSchema.pre(/^find/, function (next) {          //work on url starting with find
    this.populate({         //Filling the fields of guides in our model with actual data in referencing method
        path: 'guides',
        select: '-__v'
    });
    next();
})

tourSchema.post(/^find/, function (docs, next) {          //runs after executing of query
    console.log(`Query took ${Date.now() - this.start} milliseconds!`)
    //console.log(docs);
    next();
});

//Aggregation Middleware
// tourSchema.pre('aggregate', function (next) {
//     this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });       //unshift : for beginning of the array  //shift: for at the end of the array

//     console.log(this.pipeline());
//     next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;