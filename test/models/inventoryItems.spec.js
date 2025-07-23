/**
 * Authors: Dua Hasan, Scott Green
 * Date: 4 July 2025
 * File: inventoryItems.spec.js
 * Description: Unit tests for inventoryItem model.
 */

const mongoose = require('mongoose');
const { inventoryItem } = require('../../src/models/inventoryItem');
const request = require('supertest');
const express = require('express');

describe('Item Model Test', () => {
  // Connect to a test database
  beforeAll(async () => {
    const connectionString = 'mongodb+srv://ims_user:s3cret@bellevueuniversity.qgo4d.mongodb.net/?retryWrites=true&w=majority&appName=BellevueUniversity';
    try {
      await mongoose.connect(connectionString, {
        dbName: 'IMS_Test'
      });

      //console.log('Connection to the IMS_Test database instance was successful');
    } catch (err) {
      console.error(`MongoDB connection error: ${err}`);
    }
  });

  // Clear the database before each test
  beforeEach(async () => {
    await inventoryItem.deleteMany({});
  });

  // Close the database connection after all tests
  afterAll(async () => {  // Get rid of the jest error
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  it('should create an Item successfully', async () => {
    const ItemData = {
      categoryId: 1,
      supplierId: 3,
      name: 'Item 1',
      description: 'Description 1',
      quantity: 11,
      price: 9.99
    };

    const item = new inventoryItem(ItemData);
    const savedItem = await item.save();

    expect(savedItem.categoryId).toBe(ItemData.categoryId);
    expect(savedItem.supplierId).toBe(ItemData.supplierId);
    expect(savedItem.name).toBe(ItemData.name);
    expect(savedItem.description).toBe(ItemData.description);
    expect(savedItem.quantity).toBe(ItemData.quantity);
    expect(parseFloat(savedItem.price)).toBe(ItemData.price);
  });

  // missing categoryId
  it('should fail to create an item without required fields', async () => {
    const ItemData = {
      supplierId: 3,
      name: 'Item 1',
      description: 'Description 1',
      quantity: 11,
      price: 9.99,
      dateCreated: '2024-09-04T21:39:36.605Z'
    };

    const item = new inventoryItem(ItemData);
    let err;

    try {
      await item.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors['categoryId']).toBeDefined();
  });

  it('should update a Item\'s description successfully', async () => {
    const ItemData = {
      categoryId: 1,
      supplierId: 3,
      name: 'Item 1',
      description: 'Description 1',
      quantity: 11,
      price: 9.99,
      dateCreated: '2024-09-04T21:39:36.605Z'
    };

    const item = new inventoryItem(ItemData);
    const savedItem = await item.save();

    savedItem.description = 'otherworldly';
    const updatedItem = await savedItem.save();

    expect(updatedItem.description).toBe('otherworldly');
  });

  it('should fail to create an item without a name', async () => {
    const ItemData = {
      categoryId: 1,
      supplierId: 3,
      name: '',
      description: 'Description 1',
      quantity: 11,
      price: 9.99,
      dateCreated: '2024-09-04T21:39:36.605Z'
    };

    const item = new inventoryItem(ItemData);
    let err;

    try {
      await item.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined(); expect(err.errors['name']).toBeDefined();
    expect(err.errors['name'].message).toBe('Item name is required');
  });

  it('should fail to create a Item with a name longer than 100 characters', async () => {
    const ItemData = {
      categoryId: 1,
      supplierId: 3,
      name: 'z'.repeat(101),
      description: 'Description 1',
      quantity: 11,
      price: 9.99,
      dateCreated: '2024-09-04T21:39:36.605Z'
    };

    const item = new inventoryItem(ItemData);
    let err;

    try {
      await item.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors['name']).toBeDefined();
    expect(err.errors['name'].message).toBe('Item name cannot exceed 100 characters');
  });
});
