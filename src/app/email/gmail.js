const nodemailer = require('nodemailer');
const config = require('../../config/config');

const transporterGmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.GMAIL_USER,
        pass: config.GMAIL_PASS
    }
});

module.exports = transporterGmail;