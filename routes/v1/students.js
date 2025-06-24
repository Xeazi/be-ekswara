const express = require("express");
const { createStudent, validationMiddleware, getStudents } = require("../../controllers/students");

const router = express.Router();

router.get("/students", getStudents);
router.post("/student", validationMiddleware, createStudent);

module.exports = router;
