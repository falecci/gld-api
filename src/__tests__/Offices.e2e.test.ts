import * as request from 'supertest';

import App from '../App';

describe('offices', () => {
  const app = new App();
  const appInstance = app.build();

  it('should paginate correctly', async () => {
    const response = await request(appInstance).get(
      '/v1/offices?limit=2&offset=2',
    );

    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
      {
        address: '1 Chome-1-2 Oshiage, Sumida City',
        city: 'Tokyo',
        country: 'Japan',
        id: 5,
      },
    ]);
  });

  it('should work with single office', async () => {
    const response = await request(appInstance).get('/v1/offices/1');

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      id: 1,
      address: '450 Market St',
      city: 'San Francisco',
      country: 'United States',
    });
  });
});
