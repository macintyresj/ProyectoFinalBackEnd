const { enviarMailErrorServer } = require('../helpers/sendMail');

const errorHandler = (err, req, res, next) => {
    enviarMailErrorServer(err, req.get('host'))
    res.status(500);
    res.render('error', { error: err });
}

module.exports = errorHandler;