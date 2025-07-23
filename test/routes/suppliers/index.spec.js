/**
 * Authors: Dua Hasan, Scott Green
 * Date: 21 July 2025
 * File: index.spec.js
 * Description: Unit tests for /api/suppliers routes.
 */

const request = require("supertest");
const app = require('../../../src/app');
const { Supplier } = require('../../../src/models/supplier');
const mongoose = require('mongoose');

jest.mock('../../../src/models/supplier');  // Mock the Item model

describe('Supplier API', () => {
  afterAll(async () => {  // Get rid of the jest error
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('GET /api/suppliers', () => {
    // Tests for list all suppliers
    it('should get all suppliers', async () => {
      Supplier.find.mockResolvedValue([{
        _id: '12345',
        supplierId: 3,
        supplierName: 'Supplier 1',
        contactInformation: '555-555-5555',
        address: '555 55th St',
        dateCreated: new Date,
        dateModified: new Date
      }]); // Mock (yeah) the find method

      const response = await request(app).get('/api/suppliers');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].supplierName).toBe('Supplier 1');
    });

    it('should handle get suppliers errors', async () => {
      Supplier.find.mockRejectedValue(new Error('Database error')); // Mock an error

      const response = await request(app).get('/api/suppliers');
      expect(response.status).toBe(500);
    });

    it('should return an empty array when no suppliers are found', async () => {
      Supplier.find.mockResolvedValue([]); // Mock no documents returned

      const response = await request(app).get('/api/suppliers');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });


describe('POST /api/suppliers', () => {
    it('should create a supplier successfully', async () => {
      Supplier.prototype.save = jest.fn().mockResolvedValue({
        supplierId: 3,
        supplierName: 'New Supplier',
        contactInformation: '123-456-7890',
        address: '123 Main St',
        dateCreated: new Date()
      });

      const response = await request(app).post('/api/suppliers').send({
        supplierId: 3,
        supplierName: 'New Supplier',
        contactInformation: '123-456-7890',
        address: '123 Main St',
        dateCreated: '2025-07-21T00:00:00.000Z'
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Supplier created successfully');
    });

    it('should return validation errors for invalid data', async () => {
      const response = await request(app).post('/api/suppliers').send({
        supplierId: 3,
        supplierName: '',
        contactInformation: '',
        address: '',
        dateCreated: 'not-a-date'
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('data/supplierName must NOT have fewer than 1 characters');
    });

    it('should handle errors during supplier creation', async () => {
      Supplier.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).post('/api/suppliers').send({
        supplierId: 3,
        supplierName: 'Supplier Error',
        contactInformation: '000-000-0000',
        address: 'Error St',
        dateCreated: '2025-07-21T00:00:00.000Z'
      });

      expect(response.status).toBe(500);
    });
  });
});
