
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');    //npm i express-rate-limit
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');             //for getting access to cookie available in web browser
const path = require('path');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1)GLOBAL MIDDLEWARES

//Serving Static files
// app.use(express.static(`${__dirname}/public`))  //here we don't  need to use public in the url in web browser becoz it automatically open the file which is written after public if its in public folder
app.use(express.static(path.join(__dirname, 'public')));

//Set security HTTP headers
app.use(helmet())

//Development logging
//console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV !== 'development') {
    app.use(morgan('dev'));
}

//Limit requests from same API
const limiter = rateLimit({        //for Security Purpose
    max: 100,   //allow max. 100 req. from same IP.
    windowMs: 60 * 60 * 1000,   //windowMilliseconds : 1 hour (allow max. 100 req. in 1 hours from same IP)
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter)  //applying rate limiter global middleware only in route which start from api.

//Body parser, reading data from body into req.body
//app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' })); //middleware : - that can modify the incoming request data || Accepting only max. 10kb of data
app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize())    //It looks at req.body, req.queryString and req.params and filters out all of the dollar signs and dots.


//Data sanitization against Cross-Side Scripting Attacks(XSS)
app.use(xss())   //It will clean any user's input from malicious HTML code.

//Prevent parameter pollution
app.use(hpp({
    whitelist: ['duration',
        'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}));

/*app.use((req, res, next) => {
    console.log('Hello from the middleware');  //middleware : It executed before response-request cycle ends.
    next();
});
*/

//Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.cookies);
    next();
})
// app.get('/', (req, res) =>{
//     //res.status(200).send('Hello from the server side!');
//     res.status(200).json({message: 'Hello from the server side!', app: 'Natours'});
// });

// app.post('/', (req, res) =>{
//     res.send('You can post to this endpoint...');
// });


//const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)); // JSON.parse will convert json into javascript object

// 2). ROUTE HANDLERS
/*const getAllTours = (req, res) =>{
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
};
*/

// app.get('/api/v1/tours', (req, res) =>{
//     res.status(200).json({
//         status: 'success',
//         results: tours.length,
//         data: {
//             tours    
//         }
//     });
// });

// app.get('/api/v1/tours/:id/:x/:y?', (req, res) =>{      //: used to define id variable
//     console.log(req.params);     //req.params assign value to the variable we define(id)

//     res.status(200).json({
//         status: 'success',
//     });
// });



//  app.get('/api/v1/tours/:id', (req, res) =>{      //: used to define id variable
//      console.log(req.params);     //req.params assign value to the variable we define(id)
//      const id = req.params.id * 1;   //convert string into number as before id is in string in json
//      const tour = tours.find(el => el.id === id)

//      //if(id > tours.length){
//          if(!tour){
//          return res.status(404).json({
//              status: 'fail',
//              message: 'Invalid ID'
//          });
//      }

//      res.status(200).json({
//          status: 'success',
//          data: {
//              tour
//         }
//      });
//  });



/*app.post('/api/v1/tours', (req, res)=>{
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
});*/


/*app.patch('/api/v1/tours/:id', (req, res)=>{
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
});*/

/*app.delete('/api/v1/tours/:id', (req, res)=>{
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
});*/

/*
const getAllUsers = (req, res) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

const getUser = (req, res) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

const createUser = (req, res) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

const updateUser = (req, res) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

const deleteUser = (req, res) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};
*/


/*app.get('/api/v1/tours', getAllTours);
app.get('/api/v1/tours/:id', getTour);
app.post('/api/v1/tours', createTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);*/

//3). ROUTES

//const tourRouter = express.Router(); 
//const userRouter = express.Router();

//app.route('/api/v1/tours').get(getAllTours).post(createTour);
//tourRouter.route('/').get(getAllTours).post(createTour); //we don't need to give path as tourRouter(parent route) always will run on path given in app.use function

//app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);
//tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

//app.route('/api/v1/users').get(getAllUsers).post(createUser);
//userRouter.route('/').get(getAllUsers).post(createUser);

//app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);
//userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// 3) ROUTES  
// app.get('/', (req, res) => {
//     res.status(200).render('base', {
//         tour: 'The Forest Hiker',
//         user: 'Jonas'
//     });
// });

// app.get('/overview', (req, res) => {
//     res.status(200).render('overview', {
//         title: 'All Tours'
//     });
// });

// app.get('/tour', (req, res) => {
//     res.status(200).render('tour', {
//         title: 'The Forest Hiker Tour'
//     });
// });

app.use("/", viewRouter);  //(Mounting Router) , Middleware
app.use("/api/v1/tours", tourRouter);  //(Mounting Router) , Middleware
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {          // first upper two route will execute, if upper two not execute then it will come here //all for all types of request(post, get, etc..),  * means any route
    /*res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    })
    */

    /* const err = new Error(`Can't find ${req.originalUrl} on this server!`)
     err.status = 'fail',
         err.statusCode = 404;   
 
     next(err); */               //this will skip all middleware and goes straight to error handling middleware

    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

/*app.use((err, req, res, next) => {              //express automatically knows this is error handling middleware as it has 4 parameters
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});
*/
app.use(globalErrorHandler);

// 4) START SERVER
/*const port = 3000;
app.listen(port, () =>{
    console.log(`App running on ${port}...`);
});*/

module.exports = app;