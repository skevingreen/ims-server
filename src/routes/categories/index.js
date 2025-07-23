/**
 * Authors: Dua Hasan, Scott Green
 * Date: 4 July 2025
 * File: index.js
 * Description: Routing for the category APIs.
 */

const express = require('express');
const router = express.Router();
const { Category } = require('../../models/category');

router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find({});

    res.send(categories);
  } catch (err) {
    console.error(`Error while getting categories: ${err}`);
    next(err);
  }
});

module.exports = router;
