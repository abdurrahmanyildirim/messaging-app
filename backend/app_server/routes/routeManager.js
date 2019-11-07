var authRoute = require('./authRoute');
var settingRoute = require('./settingRoute');

module.exports = (app) => {
    app.use('/auth', authRoute);
    app.use('/setting', settingRoute)
}