'use strict';

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_URI);

const Book = require('.models/bookModel');

async function seed() {
  // seed the database with some books, so I can retrieve them
  const myBook = new Book({
    title: 'Book of Pedro',
    description: 'The Story of Pedro',
    status: 'Available',
    email: 'placeholder',
  });
  myBook.save(function (err) {
    if (err) console.error(err);
    else console.log('saved New Book 1');
  });

  // alternately...
  await Book.create({
    title: 'Book of Aoife',
    description: 'The Story of Aoife',
    status: 'Available',
    email: 'placeholder',
  });

  console.log('saved New Book 2');

  mongoose.disconnect();
}

seed();
