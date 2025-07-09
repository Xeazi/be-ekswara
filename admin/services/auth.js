const query = require("../../database");

async function getAllAdmins() {
    
    try {
        const result = await query(
            `SELECT username, password_hash FROM admins`
        );

        return result;

    } catch (error) {
        throw error;
    }
}

async function getAdmin(username) {

    try {
        const result = await query(
            `SELECT username, password_hash FROM admins
            WHERE
               username = ? 
            `, 
            [username]
        );

        return result;

    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllAdmins,
    getAdmin
}