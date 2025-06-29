const multer = require("multer");
const { customerDir } = require("../utils/file");

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
       cb(null, customerDir);
   },
   filename: function (req, file, cb) {
       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
       console.log('uniqueSuffix: ', uniqueSuffix + '-' + file.originalname);
       cb(null, uniqueSuffix + '-' + file.originalname);
   }
});

const upload = multer({storage: storage}).fields([
    {name: 'image', maxCount: 1},
    {name: 'avatar', maxCount: 1},
]); // 'image' ini harus sama persis di postman

module.exports = upload;