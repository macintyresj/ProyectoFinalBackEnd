const { loggerWarn } =require('../../config/log4js');

const error404 = (req, res, next) => {
    loggerWarn.warn(`Ruta ${req.originalUrl} método ${req.method} no implementada`)
    res.status(404).json({ error: -2, descripcion: `ruta ${req.originalUrl} método ${req.method} no implementada` });
    next();  
}

module.exports = error404;