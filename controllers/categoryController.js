const Category = require('../models/categories');

exports.category_list = (req, res) => {
  res.send('NOT IMPLEMENTED: Category list');
};

exports.category_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Category detail: ${req.params.id}`);
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
