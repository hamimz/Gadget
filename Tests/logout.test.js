const request = require('supertest');
const express = require('express');
const router = require('./logout');
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

describe('Logout routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /logout - authorized user', async () => {
    doQuery.mockImplementationOnce(() => [{ id_products: 1, name: 'Product 1' }]);
    doQuery.mockImplementationOnce(() => [
      { id_reviews: 1, comment: 'Review 1', rating: 5, id_users: 1, id_products: 1 },
    ]);

    const response = await request(app).get('/logout');

    expect(response.status).toBe(302);
    
    expect(doQuery).toHaveBeenCalledTimes(0);
  });

  
});

