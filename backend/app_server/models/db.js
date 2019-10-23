var mongoose = require('mongoose');

var mongoDb = 'mongodb://localhost/MessaginApp';

mongoose.connect(mongoDb, {useUnifiedTopology: true , useCreateIndex: true, useNewUrlParser: true }, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Bağlantı başarılı')
    }
})