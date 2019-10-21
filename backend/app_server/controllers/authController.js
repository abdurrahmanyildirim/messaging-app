
module.exports.login = (req, res) => {
    console.log('Login')
    res.send({ message: 'Login' });
}

module.exports.register = (req, res) => {
    console.log('Register')
    res.send({ message: 'register' });
}

