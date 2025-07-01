const query = require("../../database");

async function getAllAdmins() {
    try {
        const result = await query(
            `SELECT username, password_hash FROM admins`
        );
        console.log(result); // hapus
        return result;

    } catch (error) {
        throw error;
    }
}

async function getAdmin(username) {
    console.log(username);
    try {
        const result = await query(
            `SELECT username, password_hash FROM admins
            WHERE
               username = ? 
            `, 
            [username]
        );
        console.log(result); // hapus
        return result;

    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllAdmins,
    getAdmin
}