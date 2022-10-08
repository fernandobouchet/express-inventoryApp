const Movie = require('../models/movies');
const Category = require('../models/categories');

const async = require('async');

exports.index = (req, res) => {
  async.parallel(
    {
      movies_count(callback) {
        Movie.countDocuments({}, callback);
      },
      categories_count(callback) {
        Category.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render('index', { title: 'Movies Rent', error: err, data: results });
    }
  );
};

exports.movie_list = (req, res, next) => {
  Movie.find({}, 'name category')
    .sort({ name: 1 })
    .populate('category')
    .exec((err, list_movies) => {
      if (err) {
        return next(err);
      }
      res.render('movie_list', {
        title: 'Movies',
        movie_list: list_movies,
      });
    });
};

exports.movie_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Movie detail: ${req.params.id}`);
};

exports.movie_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Movie create GET');
};

exports.movie_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Movie crete POST');
};

exports.movie_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Movie delete GET');
};

exports.movie_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Movie delete POST');
};

exports.movie_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Movie update GET');
};

exports.movie_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Movie update POST');
};
