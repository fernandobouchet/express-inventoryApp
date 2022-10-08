const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movieController');
const categoryController = require('../controllers/categoryController');

// MOVIES ROUTES //

router.get('/', movieController.index);

router.get('/movie/create', movieController.movie_create_get);

router.post('/movie/create', movieController.movie_create_post);

router.get('/movie/:id/delete', movieController.movie_delete_get);

router.post('/movie/:id/delete', movieController.movie_delete_post);

router.get('/movie/:id/update', movieController.movie_update_get);

router.post('/movie/:id/update', movieController.movie_update_post);

router.get('/movie/:id', movieController.movie_detail);

router.post('/movies', movieController.movie_list);

// CATEGORIES ROUTES //

router.get('/category/create', categoryController.category_create_get);

router.post('/category/create', categoryController.category_create_post);

router.get('/category/:id/delete', categoryController.category_delete_get);

router.post('/category/:id/delete', categoryController.category_delete_post);

router.get('/category/:id/update', categoryController.category_update_get);

router.post('/category/:id/update', categoryController.category_update_post);

router.get('/category/:id', categoryController.category_detail);

router.post('/categories', categoryController.category_list);

module.exports = router;
