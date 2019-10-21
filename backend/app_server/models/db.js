var mongoose = require('mongoose');

mongoose.Promise = require('bluebird')

var mongoDb = 'mongodb://localhost/MessaginApp';

mongoose.connect(mongoDb,{useNewUrlParser: true}, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Bağlantı başarılı')
    }
})