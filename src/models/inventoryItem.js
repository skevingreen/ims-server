/**
 * Authors: Dua Hasan, Scott Green
 * Date: 18 July 2025
 * File: category.js
 * Description: Mongoose model for inventoryItem documents.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let inventoryItemSchema = new Schema({
  categoryId: {
    type: Number,
    required: [true, 'Item categoryId is required'] // validations
  },
  supplierId: {
    type: Number,
    required: [true, 'Item supplierId is required']
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    minlength: [1, 'Item name must be at least 1 character'],
    maxlength: [100, 'Item name cannot exceed 100 characters'],
    unique: true  // Name must be unique
  },
  description: {
    type: String,
    required: [true, 'Item description is required'],
    minlength: [1, 'Item description must be at least 1 character'],
    maxlength: [500, 'Item description cannot exceed 500 characters']
  },
  quantity: {
    type: Number,
    required: [true, 'Item quantity is required'],
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: props => `Negative quantity is not allowed: ${props.value}`
    }
  },
  price: {
    type: mongoose.Types.Double,  // Note: a number like 100.00 will be stored as a double but in the form of 100
    required: [true, 'Item price is required'],
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: props => `Negative price is not allowed: ${props.value}`
    }
  },
  dateCreated: {
    type: String,
    default: new Date().toISOString()
  },
  dateModified: {
    type: String
  }
}, {collection: 'inventoryItems'});

inventoryItemSchema.pre('save', function(next) {  // pre db hook
  if (!this.isNew) {                              // when record saved, date modified is updated
    this.dateModified = new Date().toISOString();
  }
  next();
})

module.exports = {
  inventoryItem: mongoose.model('inventoryItem', inventoryItemSchema)
}
