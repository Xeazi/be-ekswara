const express = require("express");
const { createStudent, validationMiddleware, getStudents } = require("../../controllers/students");

const router = express.Router();

router.get("/students", getStudents);
router.post("/students", validationMiddleware, createStudent);

module.exports = router;