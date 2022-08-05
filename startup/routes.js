const express = require('express');
const users = require('../routes/users')
//const login = require('../routes/login')
const posts = require('../routes/posts')
const types = require('../routes/types')
const error = require('../middleware/error')

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/users', users)
    app.use('/api/types', types)
    //app.use('/api/login', login)
    app.use('/api/posts', posts)
    app.use(error)
}