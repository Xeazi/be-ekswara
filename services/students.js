const query = require("../database");

async function getAllStudent() {
  try {
    const result = await query(
      `SELECT 
        s.id, s.firstname, s.lastname, s.email, s.phone_number as phoneNumber,
        r.id as roleId, r.name as role
      FROM students s 
      LEFT JOIN roles r ON s.role_id = r.id`
    );

    return result;
  } catch (error) {
    throw error;
  }
}

async function createStudent({ firstname, lastname, email, phoneNumber }) {
  try {
    return await query(
      `INSERT INTO students (firstname, lastname, email, phone_number, role_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [firstname, lastname, email, phoneNumber, 1]
    );
  } catch (error) {
    throw error;
  }
}

async function deleteStudent(id) {
  try {
    return await query(`DELETE FROM students WHERE id = ?`, [id]);
  } catch (error) {
    throw error;
  }
}

async function updateStudent({id, firstname, lastname, email, phoneNumber}){
  // update query
}

module.exports = {
  getAllStudent,
  createStudent,
  deleteStudent, 
  updateStudent
};
