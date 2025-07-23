/**
 * Authors: Dua Hasan, Scott Green
 * Date: 18 July 2025
 * File: index.spec.js
 * Description: Unit tests for /api/items routes.
 */

const request = require("supertest");
const app = require('../../../src/app');
const { inventoryItem } = require('../../../src/models/inventoryItem');
const mongoose = require('mongoose');

jest.mock('../../../src/models/inventoryItem');  // Mock the Item model

describe('Item API', () => {
  afterAll(async () => {  // Get rid of the jest error
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('GET /api/items', () => {
    // Tests for list all inventory items
    it('should get all items', async () => {
      inventoryItem.find.mockResolvedValue([{
        _id: '12345',
        categoryId: 1,
        supplierId: 3,
        name: 'Item 1',
        description: 'Description 1',
        quantity: 11,
        price: 9.99,
        dateCreated: '2024-09-04T21:39:36.605Z'
      }]); // Mock (yeah) the find method

      const response = await request(app).get('/api/items');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].name).toBe('Item 1');
    });

    it('should handle get items errors', async () => {
      inventoryItem.find.mockRejectedValue(new Error('Database error')); // Mock an error

      const response = await request(app).get('/api/items');
      expect(response.status).toBe(500);
    });

    it('should return an empty array when no items are found', async () => {
      inventoryItem.find.mockResolvedValue([]); // Mock no documents returned

      const response = await request(app).get('/api/items');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  // Tests for creating an inventory item
  describe('POST /api/items', () => {
    it('should create an item successfully', async () => {
      inventoryItem.prototype.save.mockResolvedValue({ inventoryItemId: '123abc456efg' }); // Mock the save method

      const response = await request(app).post('/api/items').send({
        categoryId: 5000,
        supplierId: 5,
        name: "Hungry Hippos",
        description: 'Have your hippo eat the most marbles to win.',
        quantity: 7,
        price: 18.98,
        dateCreated: '2024-09-04T21:39:36.605Z',
        dateModified: '2025-09-04T21:39:36.605Z'
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Item created successfully');
    });

    it('should return validation errors for invalid data', async () => {
      const response = await request(app).post('/api/items').send({
        categoryId: 5000,
        supplierId: 5,
        name: '',   // name cannot be blank
        description: 'Have your hippo eat the most marbles to win.',
        quantity: 7,
        price: 18.98,
        dateCreated: '2024-09-04T21:39:36.605Z',
        dateModified: '2025-09-04T21:39:36.605Z'
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('data/name must NOT have fewer than 1 characters');
    });

    it('should handle post items errors', async () => {
      inventoryItem.prototype.save.mockRejectedValue(new Error('Database error')); // Mock an error

      const response = await request(app).post('/api/items').send({
        categoryId: 5000,
        supplierId: 5,
        name: 'Hungry Hippos',
        description: 'Have your hippo eat the most marbles to win.',
        quantity: 7,
        price: 18.98,
        dateCreated: '2024-09-04T21:39:36.605Z',
        dateModified: '2025-09-04T21:39:36.605Z'
      });

      expect(response.status).toBe(500);
    });
  });

  // Tests for updating an inventory item
  describe('PATCH /api/items/:inventoryItemId', () => {
    it('should update a item successfully', async () => {
      const mockItem = {
        _id: '507f1f77bcf86cd799439011',
        categoryId: 57,
        supplierId: 75,
        name: 'Thingy',
        description: 'thing-a-ma-jig',
        quantity: 23,
        price: 1.00,
        set: jest.fn(),
        save: jest.fn().mockResolvedValue(true)
      };

      inventoryItem.findOne.mockResolvedValue(mockItem);
      const response = await request(app).patch('/api/items/507f1f77bcf86cd799439011').send({
        categoryId: 57,
        supplierId: 75,
        name: 'Thingy',
        description: 'thing-a-ma-jig',
        quantity: 23,
        price: 1.00
      });

      expect(response.status).toBe(200); expect(response.body.message).toBe('Item updated successfully');
    });

    it('should handle patch errors', async () => {
      inventoryItem.findOne.mockRejectedValue(new Error('Database error')); // Mock an error

      const response = await request(app).patch('/api/items/12345');
      expect(response.status).toBe(500);
    });

    it('should return 404 if item does not exist', async () => {
      inventoryItem.findOne.mockResolvedValue(null); // Simulate item not found

      const response = await request(app)
        .patch('/api/items/507f1f77bcf86cd799439099') // Some non-existing ID
        .send({
          categoryId: 57,
          supplierId: 75,
          name: 'NonExistent',
          description: 'No description',
          quantity: 0,
          price: 0
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/not found/i);
    });
  });

  // Tests for retrieving an item by id
  describe('GET /api/items/:inventoryItemId', () => {
    it('should retrieve a single item by ID', async () => {
      const mockItem = {
        _id: '507f1f77bcf86cd799439011',
        categoryId: 1,
        supplierId: 2,
        name: 'Sample Item',
        description: 'Sample description',
        quantity: 10,
        price: 99.99,
        dateCreated: '2024-01-01T00:00:00.000Z'
      };

      inventoryItem.findOne.mockResolvedValue(mockItem);

      const response = await request(app).get('/api/items/507f1f77bcf86cd799439011');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        _id: mockItem._id,
        name: mockItem.name,
        quantity: mockItem.quantity,
      });
    });

    it('should return 404 if item not found', async () => {
      inventoryItem.findOne.mockResolvedValue(null);

      const response = await request(app).get('/api/items/507f1f77bcf86cd799439099');

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/not found/i);
    });

    it('should handle errors when fetching an item', async () => {
      inventoryItem.findOne.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/items/507f1f77bcf86cd799439011');

      expect(response.status).toBe(500);
    });

  });

  // Tests for deleting an inventory item
  describe('DELETE /api/items/:inventoryItemId', () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear any previous mock calls
    });

    it('should delete an item successfully', async () => {
      inventoryItem.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const res = await request(app).delete('/api/items/507f1f77bcf86cd799439011');
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);
    });

    it('should return 404 if item is not found', async () => {
      inventoryItem.deleteOne.mockResolvedValue({ deletedCount: 0 });

      const res = await request(app).delete('/api/items/507f1f77bcf86cd799439011');
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/not found/i);
    });

    it('should handle errors during deletion', async () => {
      inventoryItem.deleteOne.mockRejectedValue(new Error('Database error'));

      const res = await request(app).delete('/api/items/507f1f77bcf86cd799439011');
      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/error/i);
    });
  });

  // Tests specific to searching for items by a particular category
  describe('GET /api/bycategory/:categoryId', () => {
    it('should retrieve all items that have the given category id', async () => {
      const mockItem = [{ // array of fake items
        _id: '507f1f77bcf86cd799439011',
        categoryId: 1,
        supplierId: 2,
        name: 'Sample Item',
        description: 'Sample description',
        quantity: 10,
        price: 99.99,
      }];

      inventoryItem.find.mockResolvedValue(mockItem); // mock the return value based on mockItem

      const response = await request(app).get('/api/items/bycategory/1'); // make the database call

      expect(response.status).toBe(200);                // should receive a 200 ok from the database call
      expect(Array.isArray(response.body)).toBe(true);  // response should contain an array of items
      expect(response.body[0]).toMatchObject({          // response should match the mockItem
        _id: mockItem[0]._id,
        categoryId: mockItem[0].categoryId,
        supplierId: mockItem[0].supplierId,
        name: mockItem[0].name,
        quantity: mockItem[0].quantity,
        price: mockItem[0].price
      });
    });

    // Check for a 404 if no items can be found for the given category
    it('should return 404 if items by category not found', async () => {
      inventoryItem.find.mockResolvedValue(null);

      const response = await request(app).get('/api/items/bycategory/1'); // make the database call with a category of 1

      expect(response.status).toBe(404);                                  // we should get the 404
      expect(response.body.message).toMatch(/not found/i);                // message should include 'not found'
    });

    // Generic error handler
    it('should handle errors when fetching an item', async () => {
      inventoryItem.find.mockRejectedValue(new Error('Database error'));  // simulate a server error response

      const response = await request(app).get('/api/items/bycategory/1'); // make the database call

      expect(response.status).toBe(500);                                  // server error should be a 500
    });
  });
});
