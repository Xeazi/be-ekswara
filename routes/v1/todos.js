const express = require("express");
const { getTodos, validationMiddleware, createTodo } = require("../../controllers/todos");

const router = express.Router();

router.get("/todos", getTodos);
router.post("/todo", validationMiddleware, createTodo);

module.exports = router;
