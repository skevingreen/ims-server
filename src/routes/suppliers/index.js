/**
 * Authors: Dua Hasan, Scott Green
 * Date: 4 July 2025
 * File: index.js
 * Description: Routing for the supplier APIs.
 */

const express = require('express');
const Ajv = require('ajv');
const createError = require('http-errors');
const router = express.Router();
const { addSupplierSchema /*, updateGardenSchema*/ } = require('../../schemas');
const { Supplier } = require('../../models/supplier');


const ajv = new Ajv();
const validateAddSupplier = ajv.compile(addSupplierSchema);

// Get a list of all suppliers
router.get('/', async (req, res, next) => {
  try {
    const suppliers = await Supplier.find({});

    res.send(suppliers);
  } catch (err) {
    console.error(`Error while getting suppliers: ${err}`);
    next(err);
  }
});

// Create a supplier
router.post('/', async (req, res, next) => {
  try {
    const valid = validateAddSupplier(req.body); // validate request body

    if (!valid) {
      return next(createError(400, ajv.errorsText(validateAddSupplier.errors)));
    }

    const payload = {
      ...req.body
    };

    const supplier = new Supplier(payload);
    await supplier.save();

    res.send({
      message: 'Supplier created successfully',
      id: supplier._id
    });
  } catch (err) {
    console.error(`Error while creating supplier: ${err}`);
    next(err);
  }
});
module.exports = router;
