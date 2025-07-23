/**
 * Authors: Dua Hasan, Scott Green
 * Date: 22 July 2025
 * File: supplier.js
 * Description: Mongoose model for supplier documents.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the counter schema
let counterSchema = new Schema({
  _id: { type: String, required: true },  // sequence name, e.g. 'supplierId'
  seq: { type: Number, default: 0 }
});

// Create a counter model
const Counter = mongoose.model('Counter', counterSchema);

// Define the supplier schema
let supplierSchema = new Schema({
  // _id: {
  //   type: String,
  // },
  supplierId: {
    type: Number,
    required: [true, 'Supplier supplierId is required'], // validations
    unique: true
  },
  supplierName: {
    type: String,
    required: [true, 'Supplier supplierName is required'],
    minlength: [1, 'Supplier supplierName must be at least 1 character'],
    maxlength: [100, 'Supplier supplierName cannot exceed 100 characters'],
    unique: true
  },
  contactInformation: {
    type: String,
    required: [true, 'Supplier contactInformation is required'],
    minlength: [12, 'Supplier contactInformation must be at least 12 character'],
    maxlength: [12, 'Supplier contactInformation cannot exceed 12 characters']
  },
  address: {
    type: String,
    required: [true, 'Supplier address is required'],
    minlength: [2, 'Supplier contactInformation must be at least 2 characters'],
    maxlength: [100, 'Supplier contactInformation cannot exceed 100 characters']
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  dateModified: {
    type: Date
  }
}, {collection: 'Suppliers'});

// Pre-validate hook to auto-increment supplierId if new doc, else update dateModified
supplierSchema.pre('validate', async function(next) {
  const doc = this;

  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'supplierId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      doc.supplierId = counter.seq;
      next();
    } catch (err) {
      console.error('Error in Counter.findByIdAndUpdate:', err);
      next(err);
    }
  } else {
    doc.dateModified = new Date();
    next();
  }
});

module.exports = {
  Supplier: mongoose.model('Supplier', supplierSchema),
  Counter: Counter
}
