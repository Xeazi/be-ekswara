// this file is only for creating function file query
const mysql = require("./config");

async function query(text = "", value = []) {
  try {
    const [result] = await mysql.query(text, value);
    
    // result can be array or object
    return result;
  } catch (error) {
    // error will be throw into a parent function
    // that where this function getting called
    throw error;
  }
}

module.exports = query