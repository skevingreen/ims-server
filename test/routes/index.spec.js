/**
 * Author: Professor Krasso
 * Modified by: GitHub Copilot
 * Date: 2 September 2024
 * File: index.spec.js
 * Description: Test the index route.
 */

const request = require('supertest');
const express = require('express');
const router = require('../../src/app');
const mongoose = require('mongoose');

// Create an instance of the Express app
const app = express();
app.use('/', router);

describe('GET /api', () => {
  afterAll(async () => {  // Get rid of jest error
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  it('should return status 200', async () => {
    const response = await request(app).get('/api');
    expect(response.status).toBe(200);
  });

  it('should return a JSON response', async () => {
    const response = await request(app).get('/api');
    expect(response.headers['content-type']).toMatch(/json/);
  });

  it('should return the correct message', async () => {
    const response = await request(app).get('/api');
    expect(response.body).toHaveProperty('message', 'Hello from the Inventory Management System server!');
  });
});
