const request = require('supertest');

const app = require('../../src/app')
const factory = require('../factories');
const truncate = require('../utils/truncate');

describe('authentication', () => {
  beforeEach( async () => {
    await truncate();
  });

  it('should authenticate with valid credentials ', async () => {
    const user = await factory.create('User', {
      password: 'testando'
    })

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: "testando"
      })

    expect(response.status).toBe(200);
  });

  it('should not authenticate with invalid credentials', async () => {
    const user = await factory.create('User', {
      password: 'testando'
    })

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: "testando1"
      })

    expect(response.status).toBe(401);
  })

  it('should return jwt token when authenticated', async () => {
    const user = await factory.create('User', {
      password: 'testando'
    })

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: "testando"
      })

    expect(response.body).toHaveProperty("token");
  });

  it('should be able to access private routes when authenticated', async () => {
    const user = await factory.create('User', {
      password: 'testando'
    })

    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${user.generateToken()}`)

    expect(response.status).toBe(200);
  });

  it('should not be able to access private routes without token', async () => {
    const response = await request(app)
      .get('/dashboard');

    expect(response.status).toBe(401);
  });

  it('should not be able to access private routes with invalid token', async () => {
    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer 5738485`)

    expect(response.status).toBe(401);
  });
})

