// importing package that need to use
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes');
const routesAdmin = require('./admin/routes');
require('./middleware/passport'); // initial passport validation

const app = express();
var corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(bodyParser.json());

// this is API endpoint
app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
});

app.use(routes);
app.use(routesAdmin);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});