const asyncHandler = require('express-async-handler');
const Item = require('../models/Item');

exports.getIndexPage = asyncHandler(async (req, res, next) => {
  res.render('itemIndex', {
    title: 'All Items',
  });
});

exports.getDetailsPage = asyncHandler(async (req, res, next) => {
  const item = await Item.find({ _id: req.params.id });

  res.render('itemDetailPage', {
    title: `${item.name} Details`,
    item,
  });
});

exports.getCreateForm = asyncHandler(async (req, res, next) => {
  res.render('itemForm', {
    title: `Item Form`,
    item,
  });
});
