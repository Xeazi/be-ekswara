const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const privateKey = require('../../utils/privateKey')

/* di postman, key ini dimasukkin di Authorization sebelah Headers, di dalem Bearer Token */

/*

pokoknya ini ngecheck login data dari request = data di database
terus nge generate token yg isinya data user di database (yg sesuai di login) tadi DENGAN privateKey.

abis ini baru ke passport.js

*/

async function login(req, res) {
    const {email, password} = req.body;

    if (email === undefined || email === '' || password === undefined || password === '') {
        return res.status(400).json('Email and password are required')
    }

    try {
        // simulasi sederhana login

        //database dummy
        const userData = {
            fname: 'John',
            lname: 'Doe',
            email: 'example@doe.com',
            password: '$2b$10$qZ3KVy8mcxoViyGBlU01Ne.5uAg8q2mtoK5yIWcKCOyVrgPvrQ.Sm' // 1234
        };

        // malahan seharusnya engga pake attribut user(?)

        // hash password
        // const saltPassword = await bcrypt.genSalt(10)
        // console.log(saltPassword);
        // const hashPassword = await bcrypt.hash(userData.password, 10);
        // console.log(hashPassword);

        if (email !== userData.email) {
            return res.status(401).json('User not exists');
        }

        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isPasswordValid) {
            return res.status(400).json('Invalid password or email!')
        }

        console.log('in here');

        // cek apakah email dan password benar atau salah

        // generate token
        const token = jwt.sign(
            {
                email: userData.email,
                fname: userData.fname,
                lname: userData.lname,
            }, 
            // process.env.JWT_SECRET
            privateKey // , {}
        );

        return res.status(200).json({ token });

    } catch (error) {
        return res.status(400).json(error.message ?? 'Something went wrong.');        
    }


}

module.exports = {
    login,
}