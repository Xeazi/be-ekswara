// run aja sendiri
// node ./admin/services/hash.js

const bcrypt = require("bcrypt");

async function hash()     
{
    const password = 'herlo';

    const saltPassword = await bcrypt.genSalt(10)
    console.log(saltPassword);
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);

}

hash();