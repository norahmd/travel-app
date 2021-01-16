const request = require('supertest');
const app = require('../src/server/server');

describe('test /get-place', () => {
  it('should return nothing', async () => {
    const response = await request(app).get('/get-place');
    expect(response.text).toBe('{}');
  });
});
