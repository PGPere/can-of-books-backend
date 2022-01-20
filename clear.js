'use strict';

// TODO: the purpose of this file to hold a function

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_URI);

const Book = require('./models/bookModel');

async function clear() {
  try {
    await Book.deleteMany({});
    console.log('Books cleared!');
  } catch(error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
}

clear();
