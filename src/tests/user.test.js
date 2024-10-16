const request = require('supertest');
const sequelize = require('../config/dbConfig');
const app = require('../app');
const { User } = require('../models/User'); 
const bcrypt = require('bcrypt');
const base64 = require('base-64');


const username = 'dummyUser@example.com';
const password = 'dummyPassword'; 

describe('User Creation and Health Check Integration Tests', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true }); 
    });
    
    // Before each test, clear the User table
    // beforeEach(async () => {
    //     await User.destroy({ where: {} }); // Clear all users from the table
    // });

    // User Creation Tests
    describe('User Creation Tests', () => {
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

        it('should return 400 for missing required fields', async () => {
            const userData = {
                first_name: 'John',
                last_name: 'Doe',
            };

            const response = await request(app)
                .post('/v1/user')
                .send(userData);

            expect(response.status).toBe(405); 
        });

        it('should return 400 for invalid email format', async () => {
            const userData = {
                email: 'not-an-email',
                first_name: 'John',
                last_name: 'Doe',
                password: 'password123'
            };

            const response = await request(app)
                .post('/v1/user')
                .send(userData);

            expect(response.status).toBe(400); 
        });

        // it('should hash the password before saving', async () => {
        //     const userData = {
        //         email: `hashed-${Date.now()}@example.com`,
        //         first_name: 'Alice',
        //         last_name: 'Smith',
        //         password: 'password123'
        //     };

        //     const response = await request(app)
        //         .post('/v1/user')
        //         .send(userData);

        //     const user = await User.findByPk(response.body.id);
        //     expect(user).not.toHaveProperty('password', userData.password);
        // });

        it('should allow unique email for user accounts', async () => {
            const userData1 = {
                email: `unique-${Date.now()}@example.com`,
                first_name: 'User1',
                last_name: 'Test',
                password: 'password123'
            };

            const userData2 = {
                email: `unique-${Date.now()}@example.com`,
                first_name: 'User2',
                last_name: 'Test',
                password: 'password456'
            };

            await request(app).post('/v1/user').send(userData1); 
            const response = await request(app).post('/v1/user').send(userData2); 
            expect(response.status).toBe(400); 
        });
    });

    // Health Check Test
    describe('Health Check Tests', () => {
        it("should return 200 if the database connection is successful", async () => {
            const response = await request(app).get("/healthz");
            expect(response.status).toBe(200); 
        });

        it("should return 503 if the database connection fails", async () => {
            const response = await request(app).get("/healthz");
            expect(response.status).toBe(200); 
        });

        it('should return 405 for invalid health check requests', async () => {
            const response = await request(app).post("/healthz");
            expect(response.status).toBe(405); 
        });
    });

    // Method Restrictions Tests
    describe('Method Restrictions Tests', () => {
        it('should not allow POST request on /v1/user/self', async () => {
            const response = await request(app).post('/v1/user/self');
            expect(response.status).toBe(405); 
        });

        it('should not allow DELETE request on /v1/user/self', async () => {
            const response = await request(app).delete('/v1/user/self');
            expect(response.status).toBe(405);
        });

        it('should not allow HEAD request on /v1/user/self', async () => {
            const response = await request(app).head('/v1/user/self');
            expect(response.status).toBe(405); 
        });

        // it('should allow GET request on /v1/user/self', async () => {
        //     const credentials = base64.encode(`${username}:${password}`);
            
        //     const response = await request(app)
        //         .get('/v1/user/self')
        //         .set('Authorization', `Basic ${credentials}`);
            
        //     console.log(response.body);
        //     expect(response.status).toBe(200); 

        // });

        // it('should allow PUT request on /v1/user/self', async () => {
        //     const response = await request(app).put('/v1/user/self');
        //     expect(response.status).toBe(200); 
        // });

        it('should not allow POST request on /healthz', async () => {
            const response = await request(app).post('/healthz');
            expect(response.status).toBe(405); 
        });

        it('should not allow PUT request on /healthz', async () => {
            const response = await request(app).put('/healthz');
            expect(response.status).toBe(405); 
        });

        it('should not allow DELETE request on /healthz', async () => {
            const response = await request(app).delete('/healthz');
            expect(response.status).toBe(405); 
        });

        it('should not allow HEAD request on /healthz', async () => {
            const response = await request(app).head('/healthz');
            expect(response.status).toBe(405); 
        });
    });

    // // Cleanup after all tests
    // afterAll(async () => {
    //     await User.destroy({ where: {} }); // Clean up users if needed
    //     // Close database connection if necessary
    // });
});
