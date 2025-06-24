const listTodos = [
  {
    id: 1,
    title: "Todo 1",
    description: "Description 1",
    completed: false,
  },
  {
    id: 2,
    title: "Todo 2",
    description: "Description 2",
    completed: false,
  },
];

async function getTodos(req, res) {
  // res.send("<h1>Get all todos</h1>");
  return res.json(listTodos);
}

async function validationMiddleware(req, res, next) {
  const { id, title, description, completed } = req.body;

  if (
    id === undefined ||
    title === undefined ||
    description === undefined ||
    completed === undefined
  ) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  next();
}

async function createTodo(req, res) {
  const value = req.body;
  listTodos.push(value);

  return res.status(200).json({ message: "Successfully insert todo!" });
}

module.exports = {
  getTodos,
  validationMiddleware,
  createTodo,
};
