'use strict';

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_URI);

const Book = require('./models/bookModel');

async function seed() {
  // seed the database with some books, so I can retrieve them
  const myBook = new Book({
    title: 'Book of Pedro',
    description: 'The Story of Pedro',
    status: 'Available',
    email: '1223PGP',
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
    email: '321AWM',
  });

  console.log('saved New Book 2');

  await Book.create({
    title: 'Coffee',
    description: 'The Story of Coffe',
    status: 'Available',
    email: '321AWM',
  });

  console.log('saved New Book 3');

  await Book.create({
    title: 'Dunes',
    description: 'The Story of Dunes',
    status: 'Available',
    email: '321AWM',
  });

  console.log('saved New Book 4');

  await Book.create({
    title: 'Eglish Labs',
    description: 'The Story of English Lab',
    status: 'Available',
    email: '321AWM',
  });

  console.log('saved New Book 5');

  mongoose.disconnect();
}

seed();
