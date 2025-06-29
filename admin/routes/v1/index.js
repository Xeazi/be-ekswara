const express = require("express");
const passport = require("passport");

const authRouter = require("./auth")
// const uploadRouter = require("./upload");

const router = express.Router();
const apiVersion = "/v1";

// public api
router.use(apiVersion, authRouter);

// private api
// apply passport validation to all routes where that routes bellow this routes (???)
// cara 1
router.use(passport.authenticate('jwt-admin', { session: false }), (req, res, next) => {
    console.log('Authenticated');
    next();
});

// cara 2
// router.use(apiVersion, passport.authenticate('jwt', { session: false }), uploadRouter);

// router.use(apiVersion, uploadRouter);

module.exports = router;
