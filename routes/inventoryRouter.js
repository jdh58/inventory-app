const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const itemController = require('../controllers/itemController');

//
/// CATEGORIES
//

// Get category index page (home page)
router.get('/categories', categoryController.getIndexPage);

// Get category create form
router.get('/category/create', categoryController.getCreateForm);

// Post category on submit
router.post('/category/create', categoryController.postCreateForm);

// Get category details page
router.get('/category/:id', categoryController.getDetailsPage);

// Get category update form
router.get('/category/:id/update', categoryController.getUpdateForm);

// Post category updates
router.post('/category/:id/update', categoryController.postUpdateForm);

// Get category delete form
router.get('/category/:id/delete', categoryController.getDeleteForm);

// Post category deletion
router.post('/category/:id/delete', categoryController.postDeleteForm);

//
/// ITEMS
//

// Get item index page (home page)
router.get('/items', itemController.getIndexPage);

// Get item create form
router.get('/item/create', itemController.getCreateForm);

// Post item on submit
router.post('/item/create', itemController.postCreateForm);

// Get item details page
router.get('/item/:id', itemController.getDetailsPage);

// Get item update form
router.get('/item/:id/update', itemController.getUpdateForm);

// Post item updates
router.post('/item/:id/update', itemController.postUpdateForm);

// Get item delete form
router.get('/item/:id/delete', itemController.getDeleteForm);

// Post item deletion
router.post('/item/:id/delete', itemController.postDeleteForm);

module.exports = router;
