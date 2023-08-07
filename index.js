require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { authRoute } = require('./routes/auth-route');
const { dataRoute } = require('./routes/data-route');
const { reportRoute } = require('./routes/report-route')

mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;

db.on('error', (err) => console.log(err));
db.once('open', () => console.log('Connected to Database'))

const app = express();
app.use(cors())
// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });
app.use(express.json());

app.use('/data', dataRoute)
app.use('/report', reportRoute)
app.use('/auth', authRoute)

app.listen(process.env.PORT || 3000);