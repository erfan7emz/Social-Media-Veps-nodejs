const express = require('express');
const app = express();
const winston = require('winston')
const dotenv = require('dotenv')

dotenv.config();

//require('./startup/config')()
require('./startup/db')()
require('./startup/logging')()
require('./startup/prod')(app)
require('./startup/routes')(app)
require('./startup/validation')()

const port = process.env.PORT || 3000;
app.listen(port, console.log(`Listening on port ${port}`))