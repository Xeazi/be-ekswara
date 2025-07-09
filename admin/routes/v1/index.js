const express = require("express");
const passport = require("passport");

const authRouter = require("./auth")
// const uploadRouter = require("./upload");
const destinationsRouter = require("./destinations");
const eventsRouter = require("./events");

const testRouter = require("./test");

const router = express.Router();
const apiVersion = "/v1";

// public api
router.use(apiVersion, authRouter);

router.use(apiVersion, passport.authenticate('jwt-admin', { session: false }), testRouter);

// private api
router.use(apiVersion, passport.authenticate('jwt-admin', { session: false }), eventsRouter);
router.use(apiVersion, passport.authenticate('jwt-admin', { session: false }), destinationsRouter);

// router.use(apiVersion, destinationsRouter);
// router.use(apiVersion, eventsRouter);

module.exports = router;
