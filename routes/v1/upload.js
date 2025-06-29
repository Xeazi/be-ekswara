const express = require("express");
const { upload } = require("../../controllers/upload");
// const uploadMulterCustomer = require('../../middleware/customer-multer')
const uploadMulterCustomer = require('../../middleware/customer-multer-array')

const router = express.Router();

router.post("/upload", uploadMulterCustomer, upload);

module.exports = router;
