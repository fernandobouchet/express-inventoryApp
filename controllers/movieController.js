const Movie = require('../models/movies');

exports.index = (req, res) => {
  res.send('NOT IMPLEMENTED: Site Home Page');
};

exports.movie_list = (req, res) => {
  res.send('NOT IMPLEMENTED: Movie list');
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
