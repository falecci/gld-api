import * as request from 'supertest';

import App from '../App';

describe('departments', () => {
  const app = new App();
  const appInstance = app.build();

  it('should paginate correctly', async () => {
    const response = await request(appInstance).get(
      '/v1/departments?limit=3&offset=1',
    );

    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
      { id: 4, name: 'Design', superdepartment: 3 },
      { id: 5, name: 'Inbound Sales', superdepartment: 1 },
      { id: 6, name: 'Outbound Sales', superdepartment: 1 },
    ]);
  });

  it('should work with 1 expand', async () => {
    const response = await request(appInstance).get(
      '/v1/departments/9?expand=superdepartment',
    );

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      id: 9,
      name: 'Sales Development',
      superdepartment: {
        id: 6,
        name: 'Outbound Sales',
        superdepartment: 1,
      },
    });
  });

  it('should work with multiple expands', async () => {
    const response = await request(appInstance).get(
      '/v1/departments/9?expand=superdepartment.superdepartment.superdepartment.superdepartment',
    );

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      id: 9,
      name: 'Sales Development',
      superdepartment: {
        id: 6,
        name: 'Outbound Sales',
        superdepartment: {
          id: 1,
          name: 'Sales',
          superdepartment: null,
        },
      },
    });
  });

  it('should return bad request with bad expand parameters', async () => {
    const response = await request(appInstance).get(
      '/v1/departments?expand=country',
    );

    expect(response.status).toEqual(400);
    expect((response.error as any).text).toEqual(
      'Invalid expand value: country. Allowed values are: manager,department,office,superdepartment',
    );
  });

  it('should return bad request with employee expand parameter', async () => {
    const response = await request(appInstance).get(
      '/v1/departments?expand=office',
    );

    expect(response.status).toEqual(400);
    expect((response.error as any).text).toEqual(
      `Invalid expand: office for department. Allowed expands: 'superdepartment'`,
    );
  });
});
