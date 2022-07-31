const winston = require('winston')
const mongoose = require('mongoose')

module.exports = function() {
    //mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/tool')
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/veps', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to mongoDB'))
    //.then(() => winston.info('Connected to mongoDB'))
}