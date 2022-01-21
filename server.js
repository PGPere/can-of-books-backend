'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/bookModel');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose is connected')
});

app.get('/', (request, response) => {
  response.send('test request received');
});

// Create a book route that will alow us to look for books

app.get('/books',handleGetBooks);

async function handleGetBooks(request, response) {
  //console.log(request.query.email);
 try {
  let booksFromDB = await Book.find({email: request.query.email});
  //let queryObj = {};
  // console.log(booksFromDB.find(book => book.email === request.query.email));

  // if(request.query.email) {
  //   booksFromDB = booksFromDB.find(book => book.email === request.query.email);
  // }

  console.log(booksFromDB);

  if (booksFromDB !== [] && booksFromDB) {
    response.status(200).send(booksFromDB);
  } else {
    response.status(400).send('No Books Available');
  }
} catch(error) {
  console.error(error);
  response.status(500).send('Server Error');
 }
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
