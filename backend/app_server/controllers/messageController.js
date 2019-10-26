var Room = require('../models/room')

module.exports.mainPage = (req, res) => {
    //Message sayfasının verileri gönderilecek.
    console.log("Message Controller")
    res.send({ message: "Message Controller" });
}

module.exports.room = (req, res) => {
    Room.find((err, data) => {
        if (err) {
            return res.status(400).send({ message: "Veri tabanı hatası" })
        } else {
            return res.status(200).send(data)
        }
    })


}