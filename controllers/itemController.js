const asyncHandler = require('express-async-handler');

const Item = require('../models/Item');
const Category = require('../models/Category');

const { body, validationResult } = require('express-validator');

exports.getIndexPage = asyncHandler(async (req, res, next) => {
  const items = await Item.find().populate('category').exec();

  res.render('itemIndex', {
    title: 'All Items',
    items,
  });
});

exports.getDetailsPage = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate('category').exec();

  res.render('itemDetails', {
    title: `${item.name} Details`,
    item,
  });
});

exports.getCreateForm = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}, 'name').exec();

  res.render('itemForm', {
    title: `Create New Item`,
    categories,
  });
});

/* Check if item exists.
Commented becuase I don't want this functionality right now. */

// async function alreadyExists(name) {
//   try {
//     const doesExist = await Item.find({ name: name }).exec();
//     if (doesExist.length > 0) {
//       return true;
//     }
//     return false;
//   } catch (err) {
//     console.error(err);
//   }
// }

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
  body('category')
    .notEmpty()
    .trim()
    .withMessage('A category must be selected')
    .escape(),
  body('price').escape(),
  body('instock').escape(),

  asyncHandler(async (req, res, next) => {
    const newItem = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      instock: req.body.instock,
    });
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors, render the form again showing errors
      const categories = await Category.find({}, 'name').exec();
      res.render('itemForm', {
        title: `Create New Item`,
        item: newItem,
        categories,
        errors: errors.errors,
      });
      return;
    }

    // There are no errors, save the new item and redirect to the details page
    await newItem.save();
    res.redirect(newItem.url);
  }),
];

exports.getUpdateForm = asyncHandler(async (req, res, next) => {
  const [item, categories] = await Promise.all([
    Item.findById(req.params.id).populate('category').exec(),
    Category.find({}, 'title').exec(),
  ]);

  res.render('itemForm', {
    title: 'Update Item',
    categories,
    item,
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
  body('category')
    .notEmpty()
    .trim()
    .withMessage('A category must be selected')
    .escape(),
  body('price').escape(),
  body('instock').escape(),

  asyncHandler(async (req, res, next) => {
    const newItem = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      instock: req.body.instock,
      _id: req.params.id, // Same id because we want to update
    });
    const categories = await Category.find({}, 'name').exec();
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors.
      // Re-render the form with the escape entered values and errors showing.
      res.render('itemForm', {
        title: 'Update Item',
        item: newItem,
        categories,
        errors: errors.errors,
      });
      return;
    }
    // There are no errors. Update the item and redirect to the details page.
    await Item.findByIdAndUpdate(req.params.id, newItem).exec();
    res.redirect(newItem.url);
  }),
];

exports.getDeleteForm = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  res.render('itemDelete', {
    title: `Delete ${item.name}`,
    item,
  });
});

exports.postDeleteForm = asyncHandler(async (req, res, next) => {
  // There are no dependent items, so we will delete no matter what.
  await Item.findByIdAndRemove(req.params.id);

  // Redirect to the all items page
  res.redirect('/inventory/items');
});
