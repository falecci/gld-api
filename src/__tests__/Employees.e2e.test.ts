import * as request from 'supertest';

import App from '../App';

describe('employees', () => {
  const app = new App();
  const appInstance = app.build();

  it('should paginate correctly', async () => {
    const response = await request(appInstance).get(
      '/v1/employees?limit=3&offset=10',
    );

    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
      {
        first: 'Arthur',
        last: 'Reed',
        id: 11,
        manager: 1,
        department: 10,
        office: 4,
      },
      {
        first: 'Lisa',
        last: 'Long',
        id: 12,
        manager: 2,
        department: 6,
        office: 3,
      },
      {
        first: 'George',
        last: 'Morgan',
        id: 13,
        manager: 7,
        department: 7,
        office: 5,
      },
    ]);
  });

  it('should work with expand=manager', async () => {
    const response = await request(appInstance).get(
      '/v1/employees/2?expand=manager',
    );

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      first: 'Daniel',
      last: 'Smith',
      id: 2,
      manager: {
        id: 1,
        first: 'Patricia',
        last: 'Diaz',
        office: 2,
        department: 5,
        manager: null,
      },
      department: 5,
      office: 2,
    });
  });

  it('should work with expand=manager&expand=office', async () => {
    const response = await request(appInstance).get(
      '/v1/employees/2?expand=manager&expand=office',
    );
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      first: 'Daniel',
      last: 'Smith',
      id: 2,
      manager: {
        id: 1,
        first: 'Patricia',
        last: 'Diaz',
        office: 2,
        department: 5,
        manager: null,
      },
      department: 5,
      office: {
        id: 2,
        address: '20 W 34th St',
        city: 'New York',
        country: 'United States',
      },
    });
  });

  it('should work with really nested data', async () => {
    const response = await request(appInstance).get(
      '/v1/employees/10024?expand=manager.manager.manager.department.superdepartment.superdepartment',
    );
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      first: 'Brenda',
      last: 'Nelson',
      id: 10024,
      manager: {
        id: 3280,
        first: 'Lisa',
        last: 'Gonzalez',
        office: 1,
        department: 9,
        manager: {
          id: 60,
          first: 'Betty',
          last: 'Brooks',
          office: 1,
          department: 8,
          manager: {
            id: 53,
            first: 'Ryan',
            last: 'Wilson',
            office: 1,
            department: {
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
            },
            manager: 34,
          },
        },
      },
      department: 2,
      office: 3,
    });
  });

  it('should work with expand=department.superdepartment&expand=manager.office', async () => {
    const response = await request(appInstance).get(
      '/v1/employees?limit=3&expand=department.superdepartment&expand=manager.office',
    );
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
      {
        first: 'Patricia',
        last: 'Diaz',
        id: 1,
        manager: null,
        department: {
          id: 5,
          name: 'Inbound Sales',
          superdepartment: {
            id: 1,
            name: 'Sales',
            superdepartment: null,
          },
        },
        office: 2,
      },
      {
        first: 'Daniel',
        last: 'Smith',
        id: 2,
        manager: {
          first: 'Patricia',
          last: 'Diaz',
          id: 1,
          manager: null,
          department: 5,
          office: {
            id: 2,
            city: 'New York',
            country: 'United States',
            address: '20 W 34th St',
          },
        },
        department: {
          id: 5,
          name: 'Inbound Sales',
          superdepartment: {
            id: 1,
            name: 'Sales',
            superdepartment: null,
          },
        },
        office: 2,
      },
      {
        first: 'Thomas',
        last: 'Parker',
        id: 3,
        manager: null,
        department: {
          id: 4,
          name: 'Design',
          superdepartment: {
            id: 3,
            name: 'Product',
            superdepartment: null,
          },
        },
        office: null,
      },
    ]);
  });

  it('should return bad request with bad expand parameters', async () => {
    const response = await request(appInstance).get(
      '/v1/employees?expand=company',
    );

    expect(response.status).toEqual(400);
    expect((response.error as any).text).toEqual(
      'Invalid expand value: company. Allowed values are: manager,department,office,superdepartment',
    );
  });
});
