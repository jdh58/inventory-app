const asyncHandler = require('express-async-handler');

const Item = require('../models/Item');
const Category = require('../models/Category');

const { body, validationResult } = require('express-validator');

exports.getIndexPage = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().exec();

  res.render('categoryIndex', {
    title: 'All Categories',
    categories,
  });
});

exports.getDetailsPage = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  res.render('categoryDetailPage', {
    title: `${category.name} Details`,
    category,
  });
});

exports.getCreateForm = (req, res, next) => {
  res.render('categoryForm', {
    title: `Create New Category`,
  });
};

exports.postCreateForm = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Product name must be at least 2 characters long.'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage('Description must be at least 10 characters long'),

  asyncHandler(async (req, res, next) => {
    const newCategory = new Category({
      name: req.body.name,
      description: req.body.description,
    });
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors, render the form again showing errors
      res.render('categoryForm', {
        title: `Create New Category`,
        errors: errors.errors,
      });
      return;
    }

    // There are no errors, save the new category and redirect to the details page
    await newCategory.save();
    res.redirect(newCategory.url);
  }),
];

exports.getUpdateForm = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  res.render('categoryForm', {
    title: 'Update Category',
    category,
  });
});

exports.postUpdateForm = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Product name must be at least 2 characters long.'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage('Description must be at least 10 characters long'),

  asyncHandler(async (req, res, next) => {
    const newCategory = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id, // Same id because we want to update
    });
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors.
      // Re-render the form with the escape entered values and errors showing.
      res.render('categoryForm', {
        title: 'Update Category',
        category: newCategory,
        errors: errors.errors,
      });
      return;
    }
    // There are no errors. Update the category and redirect to the details page.
    await Category.findByIdAndUpdate(req.params.id, newCategory).exec();
    res.redirect(newCategory.url);
  }),
];

exports.getDeleteForm = asyncHandler(async (req, res, next) => {
  // If there are existing items with this category, do not show form and show error
  const existingItems = await Item.findById({ category: req.params.id });
  const category = await Category.findById(req.params.id);

  if (existingItems.length > 0) {
    // There are items with this category, so we can not delete. Display an error.
    res.render('categoryDelete', {
      title: `Delete ${category.name}`,
      existingItems,
    });
  }

  // Otherwise, go ahead and show the form to delete.
  res.render('categoryDelete', {
    title: `Delete ${category.name}`,
    category,
  });
});

exports.postDeleteForm = asyncHandler(async (req, res, next) => {
  // We have already checked for existing items, so go ahead and delete it.
  await Category.findByIdAndRemove(req.params.id);

  // Redirect to the all categories page
  res.redirect('/inventory/categories');
});
