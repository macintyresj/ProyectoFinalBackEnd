const { loggerWarn } = require("../../config/log4js");
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

// middleware de authentication
const checkAuthentication = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(403).json({ error: 'faltó token' });
        }

        jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, value) => {
            if (err) return res.status(500).json({ error: 'Debes iniciar sesión' });

            req.user = value.data;
            next();
        });
    } catch (error) {
        loggerWarn.warn(error);
    }
}

module.exports = checkAuthentication;
