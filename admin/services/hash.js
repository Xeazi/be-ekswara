// run aja sendiri
// node ./admin/services/hash.js

const bcrypt = require("bcrypt");

async function hash()     
{
    const password = '1234';

    const saltPassword = await bcrypt.genSalt(10)
    console.log(saltPassword);
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);

}

hash();