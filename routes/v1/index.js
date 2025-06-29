const express = require("express");

const todosRouter = require("./todos")
const studentRouter = require("./students")
const uploadRouter = require("./upload")

const router = express.Router();
const apiVersion = "/v1";

router.use(apiVersion, todosRouter);
router.use(apiVersion, studentRouter);
router.use(apiVersion, uploadRouter);

module.exports = router;
