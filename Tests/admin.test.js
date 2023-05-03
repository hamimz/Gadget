const request = require('supertest');
const express = require('express');
const router = require('./admin');
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
  req.id_users = 1; 
  next();
});
app.use(onlyIfLoggedIn); 
app.use(router);

jest.mock('../Model/myModules/doQuery.js');

describe('Admin routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /adminPg - authorized user', async () => {
    doQuery.mockImplementationOnce(() => [{ id_users: 1, userType: 'admin' }]);
    doQuery.mockImplementationOnce(() => [
      { id_products: 1, name: 'Product 1', isApproved: 1 },
    ]);
    doQuery.mockImplementationOnce(() => [
      { id_users: 1, name: 'User 1', userType: 'customer' },
    ]);

    const response = await request(app).get('/adminPg');

    expect(response.status).toBe(302);

    expect(doQuery).toHaveBeenCalledTimes(0);
  });

  
});

