

module.exports.mainPage = (req, res) => {
    //Message sayfasının verileri gönderilecek.
    console.log("Message Controller")
    res.send({message:"Message Controller"});
}