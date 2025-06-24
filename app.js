// importing package that need to use
const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes');

const app = express();
app.use(bodyParser.json());

// this is API endpoint
app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
});
app.use(routes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});