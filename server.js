'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3002;
const app = express();
app.use(cors());
app.use(express.json());

// Mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose is connected')
});
const Book = require('./models/bookModel');
const req = require('express/lib/request');
const res = require('express/lib/response');

// routes
app.get('/books', getBooks);
app.post('/books', createBook);
app.delete('/books/:id', deleteBook);
app.put('/books:id', updateBook);


// route handlers
async function getBooks(request, response) {

  try {
    const books = await Book.find({ email: request.query.email });
    response.send(books);
  } catch (e) {
    console.error(e);
    response.status(500).send(`Could not find books: unexpected server error: ${e}`);
  }
}

async function createBook(request, response) {

  try {
    const book = await Book.create(request.body);
    response.send(book);
  } catch (e) {
    console.error(e);
    response.status(500).send(`Could not create book: unexpected server error: ${e}`);
  }
}

async function deleteBook(request, response) {
  try {

    // get the user's email
    const email = request.query.email;

    // get the book's id
    const id = request.params.id;


    // with that info find the book
    const book = await Book.findOne({ _id: id, email: email });

    if (!book) {
      response.status(400).send('unable to delete book');
      return;
    }

    await Book.findByIdAndDelete(id);

    response.send('success');



  } catch (e) {
    console.error(e);
    response.status(500).send(`Could not delete book: unexpected server error: ${e}`);
  }
}

async function updateBook (request, response) {
  try {
    // Collect information about request, find book
    const email = request.query.email;
    const id = request.params.id;
    const book = await Book.findOne({ _id: id, email: email });

    // check if book exists. if not, 404
    if(!book){
      response.status(404).send('Book not found.');
      return;
    }

    // Collect new information for the book
    const { title, description, status } = request.body;

    // Update the book in the database with the new info
    const updatedBook = await Book.findByIdAndUpdate(id, { title, description, status }, { new: true, overwrite: true });

    // Send the book back so the frontend can quickly display the updates without querying the entire db again
    res.status(200).send(updatedBook);
  } catch (e) {
    console.error(e);
    response.status(500).send(`Unexpected server error: ${e}`);
  }
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
