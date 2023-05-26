const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
      const response = await request(app)
        .get('/launches')
        .expect('Content-type', /json/)
        .expect(200);
    });
  });

  describe('Test POST /launches', () => {
    const compeleteLaunchData = {
      mission: 'USS',
      rocket: ' NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'January 4, 2028',
    };

    const launchDataWithoutDate = {
      mission: 'USS',
      rocket: ' NCC 1701-D',
      target: 'Kepler-62 f',
    };
    const launchDataWithInvalideDate = {
      mission: 'USS',
      rocket: ' NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'zoot',
    };

    test('It should respond with 201 created', async () => {
      const response = await request(app)
        .post('/launches')
        .send(compeleteLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);

      const requestDate = new Date(compeleteLaunchData.launchDate.valueOf());
      const responseDate = new Date(response.body.launchDate.valueOf());

      expect(responseDate).toStrictEqual(requestDate);

      expect(response.body).toMatchObject(launchDataWithoutDate);
    });
    test('It should catch missing requrired properties', async () => {
      const response = await request(app)
        .post('/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Missing required launch property',
      });
    });

    test('It should catch invalid dates', async () => {
      const response = await request(app)
        .post('/launches')
        .send(launchDataWithInvalideDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Invalid launch date',
      });
    });
  });
});
