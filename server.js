const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();
const userRoute = require('./routes/userRoute');
const jwt = require('./jwt');



const bodyParser = require('body-parser');
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.use('/user', userRoute);


// const taskRoutes = require('./routes/taskRoutes');




app.listen(PORT, () => {
    console.log("listening on port 3000");

})