#! /usr/bin/env node

console.log(
  'This script populates some test movies, and categories to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true'
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Movie = require('./models/movies');
var Category = require('./models/categories');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = [];
var movies = [];

function categorieCreate(name, description, cb) {
  var category = new Category({ name: name, description: description });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category);
    cb(null, category);
  });
}

function movieCreate(name, description, category, price, num_stock, cb) {
  itemdetail = {
    name: name,
    description: description,
    category: category,
    price: price,
    num_stock: num_stock,
  };

  var movie = new Movie(itemdetail);
  movie.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Movie: ' + movie);
    movies.push(movie);
    cb(null, movie);
  });
}

function createCategory(cb) {
  async.series(
    [
      function (callback) {
        categorieCreate('Fantasy', 'Fantasy movie category', callback);
      },
      function (callback) {
        categorieCreate(
          'Science Fiction',
          'Science Fiction movie category',
          callback
        );
      },
      function (callback) {
        categorieCreate('Horror', 'Horror movie category', callback);
      },
    ],
    // optional callback
    cb
  );
}

function createMovies(cb) {
  async.parallel(
    [
      function (callback) {
        movieCreate(
          'The Name of the Wind (The Kingkiller Chronicle)',
          'I have stolen princesses back from sleeping barrow kings.',
          [categories[0]],
          '500',
          '25',
          callback
        );
      },
      function (callback) {
        movieCreate(
          "The Wise Man's Fear (The Kingkiller Chronicle)",
          'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue.',
          [categories[1]],
          '800',
          '30',
          callback
        );
      },
      function (callback) {
        movieCreate(
          'The Slow Regard of Silent Things',
          'Deep below the University, there is a dark place.',
          [categories[2]],
          '700',
          '20',
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createCategory, createMovies],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('Movies and categories created');
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
