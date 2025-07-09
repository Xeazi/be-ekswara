const express = require("express");

const todosRouter = require("./todos");
const studentRouter = require("./students");
const uploadRouter = require("./upload");

const destinationsRouter = require("./destinations");
const eventsRouter = require("./events");
const paymentsRouter = require("./payments");

const router = express.Router();

router.use(todosRouter);
router.use(studentRouter);
router.use(uploadRouter);

router.use(destinationsRouter);
router.use(eventsRouter);
router.use(paymentsRouter);

module.exports = router;
