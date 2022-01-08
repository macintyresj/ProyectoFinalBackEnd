const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const userController = require('../users');
const config = require('../../../config/config');
const { enviarMailRegistroUsuario } = require('../../helpers/sendMail');
const { loggerWarn } = require('../../../config/log4js');

// LocalStrategy de "login"
passport.use('login', new LocalStrategy({
    session: false,
    passReqToCallback: true
},
    async (req, username, password, done) => {
        try {

            // chequeamos si el usuario existe en mongo
            const user = await userController.list({ email: username });

            // usuario no existe
            if (!user.length) {
                return done(null, false, loggerWarn.warn('Este usuario no existe!'));
            }

            // usuario existe pero esta mal la contraseña
            if (!isValidPassword(user[0], password)) {
                return done(null, false, loggerWarn.warn('Contraseña incorrecto!'));
            }

            //TODO OK => generar el token
            return done(null, generarToken(user[0]));

        } catch (error) {
            return done(error)
        }

    }
))

// validar password
const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

// generar token
const generarToken = (user) => {
    return jwt.sign(
        { data: user },
        config.ACCESS_TOKEN_SECRET,
        { expiresIn: config.TOKEN_EXPIRATION_TIME }
    )
}


passport.use('signup', new LocalStrategy({
    session: false,
    passReqToCallback: true
},
    (req, username, password, done) => {
        try {
            findOrCreateUser = async () => {
                // buscar usuario
                const user = await userController.list({ email: username });

                // usuario ya existe
                if (user.length) {
                    return done(null, false, loggerWarn.warn('Usuario ya existe'));
                }

                let { nombre, direccion, edad, telefono } = req.body;
                let foto = req.file == undefined ? null : req.file.filename;

                // crear usuario
                const newUser = {
                    email: username,
                    password: createHash(password),
                    nombre: nombre,
                    direccion: direccion,
                    edad: edad,
                    telefono: telefono,
                    foto: foto
                }

                const userSaved = await userController.save(newUser);

                enviarMailRegistroUsuario(newUser)

                return done(null, userSaved);

            }

            process.nextTick(findOrCreateUser);

        } catch (error) {
            return done(error)
        }

    }
));

// hashear pass
const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};


// serializar
passport.serializeUser((user, done) => {
    done(null, user.id);
});
// deserializar
passport.deserializeUser(async (id, done) => {
    let user = await userController.listId(id);
    done(null, user)
});

module.exports = passport;