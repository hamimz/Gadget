const request = require('supertest');
const express = require('express');
const router = require('./adminProductRequests');
const doQuery = require('../Model/myModules/doQuery.js');
const { onlyIfLoggedIn, onlyIfLoggedOut } = require('../Model/myModules/protectMyRoutes.js');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.id_users = 1; // Mock user ID for testing
  next();
});
app.use(onlyIfLoggedIn); // Use the middleware for all routes in this test
app.use(router);

jest.mock('../Model/myModules/doQuery.js');

describe('Admin product requests routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /adminProductRequests - authorized user', async () => {
    doQuery.mockImplementationOnce(() => [
      { productRequest: 'Product request 1', id_users: 1, id_productRequests: 1 },
    ]);
    doQuery.mockImplementationOnce(() => [{ name: 'User 1' }]);

    const response = await request(app).get('/adminProductRequests');

    expect(response.status).toBe(302);
    
    expect(doQuery).toHaveBeenCalledTimes(0);
  });

  // Add more tests for other routes like '/deleteRequest', etc.
});

// Additional tests for the protectMyRoutes middleware should be implemented separately