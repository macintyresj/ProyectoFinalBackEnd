const { loggerError } = require('../../config/log4js');

class DAOFactory {

    static getPersistencia(entidad, tipo) {
        try {
            const Persistencia = require(`./${entidad}/${tipo}`);
            return Persistencia.getInstance();
        } catch (error) {
            loggerError.error(error);
        }
    }

}

module.exports = DAOFactory;