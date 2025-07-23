/**
 * Authors: Dua Hasan, Scott Green
 * Date: 14 July 2025
 * File: index.js
 * Description: Routing for the inventoryItem APIs.
 */

const express = require('express');
const Ajv = require('ajv');
const createError = require('http-errors');
const router = express.Router();
const { inventoryItem } = require('../../models/inventoryItem');
const { addItemSchema, updateItemSchema } = require('../../schemas');

// Validation
const ajv = new Ajv();
const validateAddItem = ajv.compile(addItemSchema);
const validateUpdateItem = ajv.compile(updateItemSchema);

// Get a list of all inventoryItems
router.get('/', async (req, res, next) => {
  try {
    const items = await inventoryItem.find({});

    res.send(items);
  } catch (err) {
    console.error(`Error while getting items: ${err}`);
    next(err);
  }
});

// Get a particular inventoryItem based on the provided inventoryItemId
router.get('/:inventoryItemId', async (req, res, next) => {
  try {
    const tempItem = await inventoryItem.findOne({ _id: req.params.inventoryItemId });  // don't use find() here or you're gonna have a bad time
                                                                                        // (we want to match a single item, not find multiple items)
    if (!tempItem) {
      return res.status(404).send({ message: 'Item not found' });
    }
    
    res.send(tempItem);
  } catch (err) {
    console.error(`Error while getting item: ${err}`);
    next(err);
  }
});

// Create an inventory item based on the passed in payload
router.post('/', async (req, res, next) => {
  try {
    const valid = validateAddItem(req.body);  // ensure the body is a well formed inventoryItem

    // throw a validation error if the inventoryItem to be added is not well formed
    if (!valid) {
      return next(createError(400, ajv.errorsText(validateAddItem.errors)));
    }

    // Set the valid payload to have the passed in inventoryItem properties
    const payload = {
      ...req.body // expand the request body
    }

    const item = new inventoryItem(payload);  // create a new item with the given spec
    await item.save();                        // save that item to the database

    // Send back a successful message or an error
    res.send({
      message: 'Item created successfully',
      id: item._id
    });
  } catch (err) {
    console.error(`Error while creating item: ${err}`); next(err);
  }
});

// Update the given inventoryItemId based on the provided parameters
router.patch('/:inventoryItemId', async (req, res, next) => {
  try {
    // using a variable called "item" hoses the query for some reason
    const tempItem = await inventoryItem.findOne({ _id: req.params.inventoryItemId });

    // Throw a 404 error if the inventory item to be updated could not be found
    if (!tempItem) {
      return res.status(404).send({ message: 'Item not found' });
    }

    // Perform validation to make sure the requested updates are well formed
    const valid = validateUpdateItem(req.body);

    // Throw an error if the requested property updates do not pass validation
    if(!valid) {
      return next(createError(400, ajv.errorsText(validateUpdateItem.errors)));
    }

    tempItem.set(req.body); // set the fields to be changed
    await tempItem.save();  // make the changes in the db

    // Send either a success message or the error
    res.send({
      message: 'Item updated successfully',
      id: tempItem._id
    });
  } catch (err) {
    console.error(`Error while updating item: ${err}`);
    next(err);
  }
});

// Get a list of inventoryItems based on the provided categoryId
router.get('/bycategory/:categoryId', async (req, res, next) => {
  try {
    // Execute the query with categoryId as filter
    const tempItems = await inventoryItem.find({ categoryId: req.params.categoryId });

    // If no items are found, return a 404 error
    if (!tempItems) {
      return res.status(404).send({ message: 'Item(s) by category not found' });
    }

    // Otherwise, send back the list of items that were returned by the query above
    res.send(tempItems);
  } catch (err) {
    // Log any other types of errors that occur during the query
    console.error(`Error while getting Item(s) by category: ${err}`);
    next(err);
  }
});

router.delete('/:inventoryItemId', async (req, res) => {
  try {
    const result = await inventoryItem.deleteOne({ _id: req.params.inventoryItemId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({
      message: 'Item deleted successfully',
      id: req.params.inventoryItemId
    });
  } catch (err) {
    console.error(`Error while deleting item: ${err.message}`);
    res.status(500).json({ message: 'Database error' });
  }
});

module.exports = router;
