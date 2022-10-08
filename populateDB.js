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

function movieCreate(
  title,
  release_date,
  synopsis,
  category,
  rate,
  price,
  num_stock,
  cb
) {
  itemdetail = {
    title: title,
    release_date: release_date,
    synopsis: synopsis,
    category: category,
    rate: rate,
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
        categorieCreate(
          'Action',
          'Film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.',
          callback
        );
      },
      function (callback) {
        categorieCreate(
          'Adventure',
          'An adventure film is a form of adventure fiction, and is a genre of film.',
          callback
        );
      },
      function (callback) {
        categorieCreate(
          'Fantasy',
          'Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds.',
          callback
        );
      },
      function (callback) {
        categorieCreate(
          'Science Fiction',
          'Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, interstellar travel or other technologies.',
          callback
        );
      },
      function (callback) {
        categorieCreate(
          'Comedy',
          'A comedy film is a category of film which emphasizes humor. These films are designed to make the audience laugh through amusement.',
          callback
        );
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
          'The Lord of the Rings: The Fellowship of the Ring',
          '2001-12-18',
          'Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home in order to keep it from falling into the hands of its evil creator. Along the way, a fellowship is formed to protect the ringbearer and make sure that the ring arrives at its final destination: Mt. Doom, the only place where it can be destroyed.',
          [categories[0], categories[1], categories[2]],
          '8.4',
          '500',
          '25',
          callback
        );
      },
      function (callback) {
        movieCreate(
          'The Matrix',
          '1999-03-30',
          'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.',
          [categories[0], categories[3]],
          '8.2',
          '800',
          '30',
          callback
        );
      },
      function (callback) {
        movieCreate(
          'Back to the Future',
          '1985-07-03',
          "Eighties teenager Marty McFly is accidentally sent back in time to 1955, inadvertently disrupting his parents' first meeting and attracting his mother's romantic interest. Marty must repair the damage to history by rekindling his parents' romance and - with the help of his eccentric inventor friend Doc Brown - return to 1985.",
          [categories[1], categories[3], categories[4]],
          '8.3',
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
