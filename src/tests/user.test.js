const request = require('supertest');
const app = require('../app'); 
const { User } = require('../models/User'); 

describe('User Creation Integration Tests', () => {
    afterEach(async () => {
      //  await User.destroy({ where: {} });
    });

    it('should create a user successfully', async () => {
        const userData = {
            email: `bigdata-${Date.now()}@example.com`,
            first_name: 'John',
            last_name: 'Doe',
            password: 'password123'
        };

        const response = await request(app)
            .post('/v1/user') 
            .send(userData);
        expect(response.status).toBe(201); 
        expect(response.body).toHaveProperty('id'); 
        expect(response.body.email).toBe(userData.email); 
    });

    it('should return 400 for invalid user data', async () => {
        const invalidUserData = {
            email: 'invalidemail',
            password: ''
        };

        const response = await request(app)
            .post('/v1/user')
            .send(invalidUserData);

        expect(response.status).toBe(400);  
    });

    it('should return 400 if user already exists', async () => {
        const userData = {
            email: `boston-${Date.now()}@example.com`,
            first_name: 'Jane',
            last_name: 'Doe',
            password: 'password123'
        };

        await request(app)
            .post('/v1/user')
            .send(userData);

        const response = await request(app)
            .post('/v1/user')
            .send(userData);

        expect(response.status).toBe(400); 
    });
});

describe('User and Health Check API Method Restrictions', () => {
  describe('Testing /v1/user/self', () => {
      it('should not allow POST request', async () => {
          const response = await request(app).post('/v1/user/self');
          expect(response.status).toBe(405); // Method Not Allowed
      });

      it('should not allow HEAD request', async () => {
          const response = await request(app).head('/v1/user/self');
          expect(response.status).toBe(405); // Method Not Allowed
      });

      it('should not allow DELETE request', async () => {
          const response = await request(app).delete('/v1/user/self');
          expect(response.status).toBe(405); // Method Not Allowed
      });
  });

  describe('Testing /healthz', () => {
      it('should allow GET request', async () => {
          const response = await request(app).get('/healthz');
          expect(response.status).toBe(200); // Assuming successful response for GET
      });

      it('should not allow POST request', async () => {
          const response = await request(app).post('/healthz');
          expect(response.status).toBe(405); // Method Not Allowed
      });

      it('should not allow HEAD request', async () => {
          const response = await request(app).head('/healthz');
          expect(response.status).toBe(405); // Method Not Allowed
      });

      it('should not allow DELETE request', async () => {
          const response = await request(app).delete('/healthz');
          expect(response.status).toBe(405); // Method Not Allowed
      });

      it('should not allow PUT request', async () => {
          const response = await request(app).put('/healthz');
          expect(response.status).toBe(405); // Method Not Allowed
      });
  });

  describe('Testing /v1/user', () => {
      it('should allow POST request', async () => {
          const userData = {
              email: `box-${Date.now()}@example.com`,
              first_name: 'John',
              last_name: 'Doe',
              password: 'password123'
          };

          const response = await request(app)
              .post('/v1/user')
              .send(userData);
          expect(response.status).toBe(201); 
          expect(response.body).toHaveProperty('id'); 
      });

      it('should not allow GET request', async () => {
          const response = await request(app).get('/v1/user');
          expect(response.status).toBe(405); 
      });

      it('should not allow PUT request', async () => {
          const response = await request(app).put('/v1/user');
          expect(response.status).toBe(405); 
      });

      it('should not allow DELETE request', async () => {
          const response = await request(app).delete('/v1/user');
          expect(response.status).toBe(405); 
      });

      it('should not allow HEAD request', async () => {
          const response = await request(app).head('/v1/user');
          expect(response.status).toBe(405); 
      });
  });
});
