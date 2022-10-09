const Movie = require('../models/movies');
const Category = require('../models/categories');

const async = require('async');
const { body, validationResult } = require('express-validator');

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
  Movie.find({}, 'title category')
    .sort({ name: 1 })
    .populate('category')
    .exec((err, list_movies) => {
      if (err) {
        return next(err);
      }
      res.render('movie/list', {
        title: 'Movies',
        movie_list: list_movies,
      });
    });
};

exports.movie_detail = (req, res, next) => {
  async.parallel(
    {
      movie(callback) {
        Movie.findById(req.params.id).populate('category').exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.movie === null) {
        const err = new Error('Movie not found');
        err.status = 404;
        return next(err);
      }
      res.render('movie/detail', {
        title: 'Movie Detail',
        movie: results.movie,
      });
    }
  );
};

exports.movie_create_get = (req, res, next) => {
  async.parallel(
    {
      categories(callback) {
        Category.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render('movie/form', {
        title: 'Create Movie',
        categories: results.categories,
      });
    }
  );
};

exports.movie_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === 'undefined' ? [] : [req.body.category];
    }
    next();
  },
  body('title', 'Title is required').trim().isLength({ min: 1 }).escape(),
  body('release_date', 'Release date is required')
    .optional({
      checkFalsy: true,
    })
    .isISO8601()
    .toDate(),
  body('synopsis', 'Synopsis is required').trim().isLength({ min: 1 }).escape(),
  body('categories.*').escape(),
  body('rate', 'Rate is required')
    .trim()
    .isLength({ min: 1, max: 10 })
    .escape(),
  body('price', 'Price is required').trim().isLength({ min: 1 }).escape(),
  body('num_stock', 'Number of stock is required')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    const movie = new Movie({
      title: req.body.title,
      release_date: req.body.release_date,
      synopsis: req.body.synopsis,
      category: req.body.category,
      rate: req.body.rate,
      price: req.body.price,
      num_stock: req.body.num_stock,
    });
    if (!errors.isEmpty()) {
      async.parallel(
        {
          categories(callback) {
            Category.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          for (const theCategory of results.categories) {
            if (movie.category.includes(theCategory.id)) {
              theCategory.checked = 'true';
            }
          }
          res.render('movie/form', {
            title: 'Create Movie',
            categories: results.categories,
            movie,
            errors: errors.array(),
          });
        }
      );
      return;
    }
    movie.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(movie.url);
    });
  },
];

exports.movie_delete_get = (req, res, next) => {
  Movie.findById(req.params.id).exec((err, movie) => {
    if (err) {
      return next(err);
    }
    if (movie === null) {
      res.redirect('/catalog/movies');
    }
    res.render('movie/delete', {
      title: 'Delete movie',
      movie,
    });
  });
};

exports.movie_delete_post = (req, res, next) => {
  Movie.findById(req.params.id).exec((err, results) => {
    if (err) {
      return next(err);
    }
    Movie.findByIdAndRemove(req.body.movieId, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/catalog/movies');
    });
  });
};

exports.movie_update_get = (req, res, next) => {
  async.parallel(
    {
      movie(callback) {
        Movie.findById(req.params.id).populate('category').exec(callback);
      },
      categories(callback) {
        Category.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.movie === null) {
        const err = new Error('Movie not found');
        err.status = 404;
        return next(err);
      }
      for (const theCategory of results.categories) {
        for (const movieCategory of results.movie.category)
          if (theCategory._id.toString() === movieCategory._id.toString()) {
            theCategory.checked = 'true';
          }
      }
      res.render('movie/form', {
        title: 'Update Movie',
        movie: results.movie,
        categories: results.categories,
      });
    }
  );
};

exports.movie_update_post = [
  body('title', 'Title is required').trim().isLength({ min: 1 }).escape(),
  body('release_date', 'Release date is required')
    .optional({
      checkFalsy: true,
    })
    .isISO8601()
    .toDate(),
  body('synopsis', 'Synopsis is required').trim().isLength({ min: 1 }).escape(),
  body('categories.*').escape(),
  body('rate', 'Rate is required')
    .trim()
    .isLength({ min: 1, max: 10 })
    .escape(),
  body('price', 'Price is required').trim().isLength({ min: 1 }).escape(),
  body('num_stock', 'Number of stock is required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    const movie = new Movie({
      title: req.body.title,
      release_date: req.body.release_date,
      synopsis: req.body.synopsis,
      category: req.body.category,
      rate: req.body.rate,
      price: req.body.price,
      num_stock: req.body.num_stock,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      async.parallel(
        {
          movie(callback) {
            Movie.findById(req.params.id).populate('category').exec(callback);
          },
          categories(callback) {
            Category.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          res.render('movie/form', {
            title: 'Update Movie',
            movie,
            categories: results.categories,
            errors: errors.array(),
          });
        }
      );
      return;
    }
    Movie.findByIdAndUpdate(req.params.id, movie, {}, (err, theMovie) => {
      if (err) {
        return next(err);
      }
      res.redirect(theMovie.url);
    });
  },
];
