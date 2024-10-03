// Import necessary modules
const httpMocks = require('node-mocks-http');
const { healthCheck } = require('../controllers/healthCheckController');
const { validateRequest, checkDatabaseConnection } = require('../services/healthCheckService');
const request = require('supertest');
const app = require('../app'); 

jest.mock('../services/healthCheckService', () => ({
    validateRequest: jest.fn(),
    checkDatabaseConnection: jest.fn(),
}));

describe('Health Check Controller', () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
    });

   
    describe("Integration Test for /healthz", () => {
        it("should return 200 if the database connection is successful", async () => {
            validateRequest.mockImplementation(() => {});
            checkDatabaseConnection.mockResolvedValue({ success: true });
            const response = await request(app).get("/healthz");
            expect(response.status).toBe(200);
        });

        it("should return 503 if the database connection fails", async () => {
            validateRequest.mockImplementation(() => {});
            checkDatabaseConnection.mockRejectedValue({success: false});

            const response = await request(app).get("/healthz");
            expect(response.status).toBe(503); 
        });
    });
});
