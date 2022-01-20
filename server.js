'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/bookModel');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

mongoose.connect('mongodb://localhost:27017/books-database', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose is connected')
});

app.get('/', (request, response) => {
  response.send('test request received');
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
