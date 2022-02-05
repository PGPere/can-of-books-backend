'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const verifyUser = require('./auth.js'); // lab 14

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
// app.get('/books', getBooks);
// app.post('/books', createBook);
// app.delete('/books/:id', deleteBook);
// app.put('/books/:id', updateBook);
// app.get('/user', handleGetUser);

// routes
app.get('/books', handleGetBooks); // lab 11
app.post('/books', handlePostBooks); // lab 12
app.delete('/books/:id', handleDeleteBooks); // lab 12
app.put('/books/:id', handlePutBooks); // lab 13
app.get('/user', handleGetUser); // lab 14


// route handlers
// async function getBooks(request, response) {

//   try {
//     const books = await Book.find({ email: request.query.email });
//     response.send(books);
//   } catch (e) {
//     console.error(e);
//     response.status(500).send(`Could not find books: unexpected server error: ${e}`);
//   }
// }

async function handleGetBooks(req, res) {
  // instead of verifying the user email from the req.query we now get it from the verify user function
  // in the future verifyUser could become middleware
    verifyUser(req, async (err, user) => {
      if (err) {
        res.send('invalid token');
      } else {
        try {
          const books = await Book.find({ email: user.email });
          console.log(user);
          res.send(books);
        } catch (error) {
          console.error(error);
          res.status(400).send('Could not find books');
        }
      }
    })
  }



// async function createBook(request, response) {

//   try {
//     const book = await Book.create(request.body);
//     response.send(book);
//   } catch (e) {
//     console.error(e);
//     response.status(500).send(`Could not create book: unexpected server error: ${e}`);
//   }
// }

async function handlePostBooks(req, res) {
  verifyUser(req, async (err, user) => {
    if (err) {
      res.send('invalid token');
    } else {
      const { title, description, status } = req.body;
      try {
        const newBook = await Book.create({ ...req.body, email: user.email })
        res.status(200).send(newBook)
      } catch (e) {
        res.status(500).send('server error');
      }
    }
  })
}

// async function deleteBook(request, response) {
//   try {

//     // get the user's email
//     const email = request.query.email;

//     // get the book's id
//     const id = request.params.id;


//     // with that info find the book
//     const book = await Book.findOne({ _id: id, email: email });

//     if (!book) {
//       response.status(400).send('unable to delete book');
//       return;
//     }

//     await Book.findByIdAndDelete(id);

//     response.send('success');



//   } catch (e) {
//     console.error(e);
//     response.status(500).send(`Could not delete book: unexpected server error: ${e}`);
//   }
// }

async function handleDeleteBooks(req, res) {

  verifyUser(req, async (err, user) => {
    if (err) {
      res.send('invalid token');
    } else {
      const { id } = req.params;
      try {
        const book = await Book.findOne({ _id: id, email:user.email });
        if (!book) res.status(400).send('unable to delete book');
        else {
          await Book.findByIdAndDelete(id);
          res.status(204).send('bye book');
        }
      } catch (e) {
        res.status(500).send('server error');
      }
    }
  })
}

// async function updateBook (request, response) {
//   try {
//     // Collect information about request, find book
//     const email = request.query.email;
//     const id = request.params.id;
//     const book = await Book.findOne({ _id: id, email: email });
//     console.log(`id: ${id}`);
//     console.log(`email: ${email}`);
//     console.log(`book:`);
//     console.log(book);

//     // check if book exists. if not, 404
//     if(!book){
//       response.status(404).send('Book not found.');
//       return;
//     }

//     // Collect new information for the book
//     const { title, description, status } = request.body;

//     // Update the book in the database with the new info
//     const updatedBook = await Book.findByIdAndUpdate(id, { title, description, status }, { new: true });

//     // Send the book back so the frontend can quickly display the updates without querying the entire db again
//     response.status(200).send(updatedBook);
//   } catch (e) {
//     console.error(e);
//     response.status(500).send(`Unexpected server error: ${e}`);
//   }
// }

async function handlePutBooks(req, res) {

  verifyUser(req, async (err, user) => {
    if (err) {
      res.send('invalid token');
    } else {
      const { id } = req.params;
      try {
        const book = await Book.findOne({ _id: id, email: user.email });
        if (!book) res.status(400).send('unable to update book');
        else {
          const updatedBook = await Book.findByIdAndUpdate(id, { ...req.body, email: user.email }, { new: true });
          res.status(200).send(updatedBook);
        }
      } catch (e) {
        res.status(500).send('server error');
      }
    }
  })

}

// lab 14 - Auth
// this is a route to verify the user
function handleGetUser(req, res) {
  // verifyUser is defined in the auth.js
  verifyUser(req, (err, user) => {
    // "error-first" function
    if (err) {
      // if there is a problem verifying you
      res.send('invalid token');
    } else {
      // if there is not a problem verifying you
      res.send(user);
    }
  })
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
