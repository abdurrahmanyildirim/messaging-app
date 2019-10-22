var crypto = require('crypto');
var User = require('../models/user');

module.exports.login = (req, res) => {

    if (!req.body.email || !req.body.password) {
        return res.status(404).send({
            message: 'Email ve Şifre boş bırakılamaz.',
        });
    }

    var reqEmail = req.body.email;
    var reqPassword = crypto.createHash('md5').update(req.body.password).digest("hex");
    var potentialUser = {
        where: {
            email: reqEmail,
            password: reqPassword
        },
        attributes: ['_id', 'role']
    };

    User.findOne(potentialUser)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: 'Başarısız',
                    error: 'Böyle bir kullanıcı bulunmamaktadır..'
                });
            }
            const token = jwt.sign({
                _id: user._id,
                role: user.role,
                email: user.email
            },
                'secret_key',
                {
                    expiresIn: "2d"
                }
            )
            return res.status(200).send({ message: 'success', token: token });

        })
        .catch((error) => res.status(400).send(error));

}

module.exports.register = (req, res) => {
    if (!req) {
        return res.status(404).send({ message: "Boş nesne gönderilemez." })
    }

    var userData = req.body;

    var reqUser = new User(userData);

    User.find({ nickName: reqUser.nickName })
        .then(user => {
            if (user) {
                return res.status(404).send({ message: 'Bu nick name daha önce alınmış.' });
            }
        })

    User.find({ email: reqUser.email })
        .then(user => {
            if (user) {
                return res.status(404).send({ message: 'Lütfen mail adresinizi doğru girdiğinizden emin olunuz.' });
            } else {
                reqUser.password = crypto.createHash('md5').update(reqUser.password).digest("hex");
                reqUser.role = 'Client';
                reqUser.save((err) => {
                    if (err) {
                        return res.status(404).send(err)
                    }

                    return res.status(201).send({ message: "Yeni kullanıcı oluşturuldu." });
                })
            }
        })



}

