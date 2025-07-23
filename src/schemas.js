/**
 * Authors: Dua Hasan, Scott Green
 * Date: 4 July 2025
 * File: schemas.js
 * Description: Schema for database operations.
 */

// Ajv validation schemas for items
const addItemSchema = {
  type: 'object',
  properties: {
    // Mongoose will add the _id
    categoryId: { type: 'number' },
    supplierId: { type: 'number' },
    name: { type: 'string', minLength: 1, maxLength: 100 },
    description: { type: 'string', maxLength: 500 },
    price: { type: 'number' },
    dateCreated: { type: 'string', pattern: '^(\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z)?$' },
  },
  required: ['categoryId', 'supplierId', 'name', 'description', 'price', 'dateCreated'],
  additionalProperties: true
};

const updateItemSchema = {
  type: 'object',
  properties: {
    categoryId: { type: 'number' },
    supplierId: { type: 'number' },
    name: { type: 'string', minLength: 1, maxLength: 100 },
    description: { type: 'string', maxLength: 500 },
    price: { type: 'number' },
  },
  required: ['categoryId', 'supplierId', 'name', 'description', 'price'],
  additionalProperties: true
};

// Ajv validation schemas for suppliers
const addSupplierSchema = {
  type: 'object',
  properties: {
    //supplierId: { type: 'number' },
    supplierName: { type: 'string', minLength: 1, maxLength: 100 },
    contactInformation: { type: 'string', minLength: 12, maxLength: 12 },
    address: { type: 'string', minLength: 2, maxLength: 100}
  },
  required: [/*'supplierId',*/ 'supplierName', 'contactInformation', 'address' ],
  additionalProperties: true
};

module.exports = {
  addItemSchema,
  updateItemSchema,
  addSupplierSchema
};
