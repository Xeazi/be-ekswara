const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationId = req.params.destinationId;
    const dir = path.join(__dirname, '../../', 'images', `${destinationId}`); // adjust as needed

    // Ensure the directory exists
    fs.mkdirSync(dir, { recursive: true });

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // Optional: generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Create multer instance
const upload = multer({ storage: storage });

module.exports = {upload}