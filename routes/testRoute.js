const express = require('express');
const { testControllers } = require('../controllers/testControl');



//route object
const routes = express.Router();

//routes
routes.get('/',testControllers);

module.exports = routes;


