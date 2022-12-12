const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const router = express.Router();

router.use(authController.isLoggedIn);      //every roots below this needs authentication, protecting our routes

// router.get('/', (req, res) => {
//     res.status(200).render('base', {
//         tour: 'The Forest Hiker',
//         user: 'Jonas'
//     });
// });

router.get('/', viewsController.getOverview);

// router.get('/overview', (req, res) => {
//     res.status(200).render('overview', {
//         title: 'All Tours'
//     });
// });

router.get('/tour/:slug', viewsController.getTour);
// router.get('/tour', (req, res) => {
//     res.status(200).render('tour', {
//         title: 'The Forest Hiker Tour'
//     });
// });

// /login
router.get('/login', viewsController.getLoginForm)

module.exports = router;
