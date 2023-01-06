require("dotenv").config()
const express = require("express")
const app = express()
const apiRouter = express.Router();
const morgan = require('morgan');
const cors = require('cors')

app.use(cors())

// Setup your Middleware and API Router here
app.use(morgan('dev'));
app.use(express.json())
app.use('/api', apiRouter);
app.use((req, res, next) => {
    next();
})

module.exports = app;
