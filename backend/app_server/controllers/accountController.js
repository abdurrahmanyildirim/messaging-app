const cloudinary = require('cloudinary').v2;
const config = require('../../config');
const User = require('../models/user');

module.exports.imageUpload = async (req, res) => {
    cloudinary.config({
        cloud_name: config.cloudinary_settings.cloud_name,
        api_key: config.cloudinary_settings.api_key,
        api_secret: config.cloudinary_settings.api_secret
    })

    cloudinary.uploader.upload(req.files.image.tempFilePath, function (err, image) {

        if (err) {
            console.warn(err);
            return res.status(401).send('Fotoğraf yükleme başarısız.');
        }
        const user = User.findById(req.id);
        if (user.publicId || user.publicId.length > 0) {
            cloudinary.uploader.destroy(user.publicId, (err, result) => {
                if (err) {
                    console.log(err);
                }
            })
        }

        user.publicId = image.public_id;
        user.url = image.url;

        User.updateOne({}, user, (err, result) => {
            if (err) {
                return res.status(400).send('Fotoğraf yükleme başarısız.');
            }
        });
    });

    res.status(201).send('Profil fotoğrafı değiştirildi.');
}

