const express = require("express");

const todosRouter = require("./todos")
const studentRouter = require("./students")
const uploadRouter = require("./upload")

const destinationsRouter = require("./destinations")

const router = express.Router();
const apiVersion = "/v1";

router.use(apiVersion, todosRouter);
router.use(apiVersion, studentRouter);
router.use(apiVersion, uploadRouter);

router.use(apiVersion, destinationsRouter);

module.exports = router;
