const studentsServices = require("../services/students");

async function getStudents(req, res) {
  try {
    const data = await studentsServices.getAllStudent();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json(error.message ?? "Something went wrong!");
  }
}

async function validationMiddleware(req, res, next) {
  const { firstname, lastname, email, phoneNumber } = req.body;

  if (
    firstname === undefined ||
    lastname === undefined ||
    email === undefined ||
    phoneNumber === undefined
  ) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  // validasi data berdasarakan ID

  next();
}

async function createStudent(req, res) {
  const { firstname, lastname, email, phoneNumber } = req.body;

  try {
    const result = await studentsServices.createStudent({
      firstname,
      lastname,
      email,
      phoneNumber,
    });

    return res.status(200).json({
      message: "Successfully insert students!",
      value: {
        ...req.body,
        id: result.insertId,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message ?? "Something went wrong" });
  }
}

module.exports = {
  getStudents,
  validationMiddleware,
  createStudent,
};
