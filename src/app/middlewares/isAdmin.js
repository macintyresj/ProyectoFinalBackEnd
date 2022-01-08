const { admin } = require('../../config/config');
const { loggerWarn } = require('../../config/log4js');

const isAdmin = (req, res, next) => {
    try {
        if (admin) {
            next();
        } else {
            loggerWarn.warn(`Ruta ${req.originalUrl} método ${req.method} no autorizada`);
            res.status(403).json({ error : -1, descripcion: `ruta ${req.originalUrl} método ${req.method} no autorizada` })
        }
    } catch (error) {
        loggerWarn.warn(error);
    }
}


module.exports = isAdmin;