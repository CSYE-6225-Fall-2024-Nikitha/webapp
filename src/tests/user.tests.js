const request = require('supertest');
const app = require('../app'); // Adjust this import based on your app structure
const { User } = require('../models/User'); // Import your User model
const bcrypt = require('bcrypt');

describe('User Update Tests', () => {
    let testUser;

    beforeAll(async () => {
        // Create a test user before tests run
        testUser = await User.create({
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            password: await bcrypt.hash('password123', 10),
        });
    });

    afterAll(async () => {
        // Cleanup: remove test user after tests are done
        await User.destroy({ where: { id: testUser.id } });
    });

    test('should update user details', async () => {
        const response = await request(app)
            .put(`/v1/user/self`) // Assuming you have a self-update route
            .set('Authorization', `Basic ${Buffer.from(`${testUser.email}:password123`).toString('base64')}`) // Basic Auth
            .send({
                first_name: 'Jane',
                last_name: 'Doe',
                password: 'newPassword123', // If you want to update the password
                email: testUser.email, // Email of the user being updated
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User updated successfully');
    });

    test('should not update user with invalid email', async () => {
        const response = await request(app)
            .put(`/v1/user/self`)
            .set('Authorization', `Basic ${Buffer.from(`${testUser.email}:password123`).toString('base64')}`) // Basic Auth
            .send({
                first_name: 'Jane',
                last_name: 'Doe',
                password: 'newPassword123',
                email: 'invalid.email@example.com', // Invalid email for testing
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized'); // or whatever message you expect
    });

    test('should return 401 for invalid credentials', async () => {
        const response = await request(app)
            .put(`/v1/user/self`)
            .set('Authorization', `Basic ${Buffer.from(`wrong.email@example.com:wrongpassword`).toString('base64')}`) // Invalid credentials
            .send({
                first_name: 'Jane',
                last_name: 'Doe',
                password: 'newPassword123',
                email: 'john.doe@example.com', // Original email, but we are using wrong credentials
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid credentials');
    });
});
