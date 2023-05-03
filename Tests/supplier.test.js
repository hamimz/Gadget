const request = require('supertest');
const express = require('express');
const router = require('./supplier');
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

describe('Supplier routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /supplierPg - authorized user', async () => {
    doQuery.mockImplementationOnce(() => [{ id_users: 1, userType: 'supplier' }]);
    doQuery.mockImplementationOnce(() => [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }]);

    const response = await request(app).get('/supplierPg');

    expect(response.status).toBe(302);
    expect(doQuery).toHaveBeenCalledTimes(0);
  });

  
});

