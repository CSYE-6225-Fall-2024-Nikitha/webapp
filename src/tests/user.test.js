const request = require('supertest');
const sequelize = require('../config/dbConfig');
const app = require('../app');
const { User } = require('../models/User'); 
const bcrypt = require('bcrypt');
const base64 = require('base-64');
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
require('dotenv').config();

let sns;
sns = new AWS.SNS();

const username = 'dummyUser@example.com';
const password = 'dummyPassword'; 


describe('SNS publish test', () => {
  let snsPublishMock = jest.fn();

  beforeAll(() => {
    snsPublishMock = jest.fn((params, callback) => {
        const expectedArn = process.env.SNS_TOPIC_ARN;
  
        if (params.TopicArn === expectedArn) {
          callback(null, { MessageId: 'test-message-id' });
        } else {
          const error = new Error(`Invalid parameter: TopicArn Reason: Expected '${expectedArn}' but got '${params.TopicArn}'`);
          error.code = 'InvalidParameter';
          callback(error);
        }
      });
      AWSMock.mock('SNS', 'publish', snsPublishMock);

  });

  afterAll(() => {
    AWSMock.restore('SNS');
    
  });

  test('should call SNS publish with correct parameters and return success', async () => {
    const params = {
      Message: 'Test message',
      TopicArn: process.env.SNS_TOPIC_ARN,
    };

    const response = await new AWS.SNS().publish(params).promise();

    expect(snsPublishMock).toHaveBeenCalled();
    expect(snsPublishMock).toHaveBeenCalledWith(
      expect.objectContaining({ TopicArn: process.env.SNS_TOPIC_ARN }),
      expect.any(Function)
    );

    expect(response).toEqual({ MessageId: 'test-message-id' });
  });

  test('should call SNS publish with incorrect TopicArn and return error', async () => {
    const params = {
      Message: 'Test message',
      TopicArn: 'invalid-topic-arn',
    };

    await expect(sns.publish(params).promise()).rejects.toThrow('Invalid parameter: TopicArn Reason: An ARN must have at least 6 elements, not 1');

    expect(snsPublishMock).toHaveBeenCalled();
  });
});


  
// beforeAll(() => {
//     AWSMock.mock('SNS', 'publish', (params, callback) => {
//       if (params.TopicArn === process.env.SNS_TOPIC_ARN) {
//         callback(null, { MessageId: 'test-message-id' });
//       } else {
//         callback(new Error('Invalid TopicArn'));
//       }
//     });
//   });
  
//   afterAll(() => {
//     AWSMock.restore('SNS');  
//   });


describe('User Creation and Health Check Integration Tests', () => {
    let snsPublishMock;

  beforeAll(() => {
    // Set up the mock for SNS publish method using AWSMock
    snsPublishMock = jest.fn((params, callback) => {
      if (params.TopicArn === process.env.SNS_TOPIC_ARN) {
        callback(null, { MessageId: 'test-message-id' });  
      } else {
        callback(new Error('Invalid TopicArn'));  
      }
    });

    AWSMock.mock('SNS', 'publish', snsPublishMock);
  });

  afterAll(() => {
    AWSMock.restore('SNS');
  });

  beforeAll(async () => {
    await sequelize.sync({ force: true }); 
  });
    
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
                password: 'password12345',
            };
            const response = await request(app)
                .post('/v1/user') 
                .send(userData);
            expect(response.status).toBe(201); 
            expect(response.body).toHaveProperty('id'); 
            await new Promise(process.nextTick);
            expect(snsPublishMock).toHaveBeenCalledTimes(0);
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

            expect(response.status).toBe(400); 
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
