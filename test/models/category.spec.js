/**
 * Authors: Dua Hasan, Scott Green
 * Date: 4 July 2025
 * File: category.spec.js
 * Description: Unit tests for category model.
 */

const mongoose = require('mongoose');
const { Category } = require('../../src/models/category');
const request = require("supertest");
const express = require("express");

describe('Category Model Test', () => {
  // Connect to a test database
  beforeAll(async () => {
    const connectionString = 'mongodb+srv://ims_user:s3cret@bellevueuniversity.qgo4d.mongodb.net/?retryWrites=true&w=majority&appName=BellevueUniversity';
    try {
      await mongoose.connect(connectionString, {
        dbName: 'IMS_Test'
      });

      //console.log('category.spec.js connection to the database instance was successful');
    } catch (err) {
      console.error(`MongoDB connection error: ${err}`);
    }
  });

  // Clear the database before each test
  beforeEach(async () => {
    await Category.deleteMany({});
  });

  // Close the database connection after all tests
  afterAll(async () => {  // Get rid of the jest error
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  it('should create a Category successfully', async () => {
    const CategoryData = {
      _id: '666fff666',
      categoryId: 1,
      categoryName: 'Next Big Thing',
      description: 'Would make Steve proud.',
    };

    const category = new Category(CategoryData);
    const savedCategory = await category.save();

    expect(savedCategory._id).toBeDefined(); expect(savedCategory.name).toBe(CategoryData.name);
    expect(savedCategory.categoryId).toBe(CategoryData.categoryId);
    expect(savedCategory.categoryName).toBe(CategoryData.categoryName);
    expect(savedCategory.description).toBe(CategoryData.description);
  });

  it('should fail to create a Category without required fields', async () => {
    const CategoryData = {
      _id: '666fff666',
      dateCreated: '2021-01-01T00:00:00.000Z',
    };

    const category = new Category(CategoryData);
    let err;

    try {
      await category.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors['categoryId']).toBeDefined();
    expect(err.errors['categoryName']).toBeDefined();
    expect(err.errors['description']).toBeDefined();
  });

  it('should update a Category\'s status successfully', async () => {
    const CategoryData = {
      _id: '666fff666',
      categoryId: '1',
      categoryName: 'Next Big Thing',
      description: 'Would make Steve proud.',
      dateCreated: '2021-01-01T00:00:00.000Z',
      dateModified: '2022-02-02T00:00:00.000Z'
    };

    const category = new Category(CategoryData);
    const savedCategory = await category.save();

    savedCategory.description = 'Too Cool';
    const updatedCategory = await savedCategory.save();

    expect(updatedCategory.description).toBe('Too Cool');
  });

  it('should fail to create a Category with a categoryName shorter than 1 characters', async () => {
    const CategoryData = {
      _id: '666fff666',
      categoryId: '1',
      categoryName: '',
      description: 'Would make Steve proud.',
      dateCreated: '2021-01-01T00:00:00.000Z',
      dateModified: '2022-02-02T00:00:00.000Z'
    };

    const category = new Category(CategoryData);
    let err;

    try {
      await category.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined(); expect(err.errors['categoryName']).toBeDefined();
    expect(err.errors['categoryName'].message).toBe('Category categoryName is required');
  });

  it('should fail to create a Category with a categoryName longer than 100 characters', async () => {
    const CategoryData = {
      _id: '666fff666',
      categoryId: '1',
      categoryName: 'X'.repeat(101),
      description: 'Would make Steve proud.',
      dateCreated: '2021-01-01T00:00:00.000Z',
      dateModified: '2022-02-02T00:00:00.000Z'
    };

    const category = new Category(CategoryData);
    let err;

    try {
      await category.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors['categoryName']).toBeDefined();
    expect(err.errors['categoryName'].message).toBe('Category categoryName cannot exceed 100 characters');
  });
});
