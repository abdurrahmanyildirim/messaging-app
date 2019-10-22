var authRoute = require('./authRoute');
var messageRoute = require('./messageRoute');

module.exports = (app) => {
    app.use('/auth', authRoute);
    app.use('/', messageRoute);
}