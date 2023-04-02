require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { authRoute } = require('./routes/auth-route');

mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;
db.on('error', (err) => console.log(err));
db.once('open', () => console.log('Connected to Database'))

const app = express();
app.use(express.json());

app.use('/auth', authRoute)

app.listen(process.env.PORT || 3000);