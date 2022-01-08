const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'src/public/assets')
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname)
    }
});

const upload = multer({ storage: storage });

module.exports = upload;