const authRoute = require('./authRoute');
const settingRoute = require('./settingRoute');

module.exports = (app) => {
    app.use('/auth', authRoute);
    app.use('/setting', settingRoute)
}