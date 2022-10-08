const Category = require('../models/categories');
const Movie = require('../models/movies');

const async = require('async');
const { body, validationResult } = require('express-validator');

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

exports.category_create_get = (req, res, next) => {
  res.render('category/form', { title: 'Create Category' });
};

exports.category_create_post = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category name required')
    .escape(),
  body('description')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Synopsis required')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });
    if (!errors.isEmpty()) {
      res.render('category/form', {
        title: 'Create Category',
        category,
        errors: errors.array(),
      });
      return;
    } else {
      Category.findOne({ name: req.body.name }).exec((err, found_category) => {
        if (err) {
          return next(err);
        }
        if (found_category) {
          res.redirect(found_category.url);
        } else {
          category.save((err) => {
            if (err) {
              return next(err);
            }
            res.redirect(category.url);
          });
        }
      });
    }
  },
];

exports.category_delete_get = (req, res) => {
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
        res.redirect('/catalog/categories');
      }
      res.render('category/delete', {
        title: 'Delete Category',
        category: results.category,
        movies: results.movies,
      });
    }
  );
};

exports.category_delete_post = (req, res, next) => {
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
      if (results.movies.length > 0) {
        res.render('category/delete', {
          title: 'Delete Category',
          category: results.category,
          movies: results.movies,
        });
        return;
      }
      Category.findByIdAndRemove(req.body.categoryId, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/catalog/categories');
      });
    }
  );
};

exports.category_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Category update GET');
};

exports.category_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Category update POST');
};
