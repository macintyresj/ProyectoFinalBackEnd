const { Router } = require('express');
const router = Router();
const { loggerWarn } = require('../config/log4js');


// canal chat usuarios
router.get('/chat', (req, res) => {
    try {
        res.render('chat')
    } catch (error) {
        loggerWarn.warn(`error: ${error.message}`)
    }
});

module.exports = router;