const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authServices = require("../services/auth")
const privateKey = require('../../utils/privateKey')

/* di postman, key ini dimasukkin di Authorization sebelah Headers, di dalem Bearer Token */

/*

pokoknya ini ngecheck login data dari request = data di database
terus nge generate token yg isinya data user di database (yg sesuai di login) tadi DENGAN privateKey.

abis ini baru ke passport.js

*/

async function login(req, res) {
    const {username, password} = req.body;

    if (username === undefined || username === '' || password === undefined || password === '') {
        return res.status(400).json('Username and password are required')
    }

    try {
        // simulasi sederhana login

        //database beneran

        const initialData = await authServices.getAdmin(username);

        const data = initialData[0];

        // malahan seharusnya engga pake attribut user(?)

        // hash password
        // const saltPassword = await bcrypt.genSalt(10)
        // console.log(saltPassword);
        // const hashPassword = await bcrypt.hash(userData.password, 10);
        // console.log(hashPassword);

        if (username !== data.username) {
            return res.status(401).json('Invalid Username.');
        }
        
        const isPasswordValid = await bcrypt.compare(password, data.password_hash);
        
        if (!isPasswordValid) {
            return res.status(400).json('Invalid password.')
        }

        // generate token
        const token = jwt.sign(
            {
                username: data.username
            }, 
            // process.env.JWT_SECRET
            privateKey, {expiresIn: '2h'}
        );

        return res.status(200).json({ token });

    } catch (error) {
        return res.status(400).json(error.message ?? 'Something went wrong.');        
    }

}

module.exports = {
    login,
}