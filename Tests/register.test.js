const request = require('supertest');
const express = require('express');
const router = require('./register');
const doQuery = require('../Model/myModules/doQuery.js');
const cookieParser=require('cookie-parser');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(router);

jest.mock('../Model/myModules/doQuery.js');

describe('User registration routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /register', async () => {
    const response = await request(app).get('/register');
    expect(response.status).toBe(500);
    expect(response.text).toContain('registerPg.ejs');
  });

  test('POST /register - new user', async () => {
    doQuery.mockImplementationOnce(() => false); 
    doQuery.mockImplementationOnce(() => ({})); 

    const response = await request(app)
      .post('/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword',
        userType: 'user',
      });

    expect(response.status).toBe(200);
    expect(response.text).toEqual('regComplete');
    expect(doQuery).toHaveBeenCalledTimes(2);
  });

  test('POST /register - already registered', async () => {
    doQuery.mockImplementationOnce(() => true); 

    const response = await request(app)
      .post('/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword',
        userType: 'user',
      });

    expect(response.status).toBe(200);
    expect(response.text).toEqual('alreadyRegistered');
    expect(doQuery).toHaveBeenCalledTimes(1);
  });
});

