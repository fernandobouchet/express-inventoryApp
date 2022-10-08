const Category = require('../models/categories');
const Movie = require('../models/movies');

const async = require('async');

exports.category_list = (req, res, next) => {
  Category.find()
    .sort([['name', 'ascending']])
    .exec((err, list_categories) => {
      if (err) {
        return next(err);
      }
      res.render('category/list', {
        title: 'Categories',
        categories_list: list_categories,
      });
    });
};

exports.category_detail = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      movies(callback) {
        Movie.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category === null) {
        const err = new Error('Category not found');
        err.status = 404;
        return next(err);
      }
      res.render('category/detail', {
        title: 'Category Detail',
        category: results.category,
        movies: results.movies,
      });
    }
  );
};

exports.category_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Category create GET');
};

exports.category_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Category crete POST');
};

exports.category_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Category delete GET');
};

exports.category_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Category delete POST');
};

exports.category_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Category update GET');
};

exports.category_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Category update POST');
};
