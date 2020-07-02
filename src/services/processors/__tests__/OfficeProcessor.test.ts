import 'reflect-metadata';

import OfficeProcessor from '../OfficeProcessor';
import IRepository from '../../../interfaces/IRepository';
import Office from '../../../models/Office';

afterEach(() => {
  jest.clearAllMocks();
});

describe('OfficeProcessor', () => {
  const office = {
    id: 2,
    address: '20 W 34th St',
    city: 'New York',
    country: 'United States',
  };

  const employee = {
    first: 'Daniel',
    last: 'Smith',
    id: 2,
    manager: 1,
    department: 5,
    office: 2,
  };

  const manager = {
    department: 5,
    first: 'Patricia',
    last: 'Diaz',
    id: 1,
    manager: null,
    office: 2,
  };

  const RepositoryMock = jest.fn<IRepository<Office>, []>(() => ({
    getAll: jest.fn(),
    getById: jest.fn(),
    getByIds: jest.fn(() => Promise.resolve([office])),
  }));

  it('should work with 1 expand', async () => {
    const repositoryMock = new RepositoryMock();
    const officeProcessor = new OfficeProcessor(repositoryMock);

    const employees = [Object.assign({}, employee)];

    officeProcessor.setup({
      data: {},
      maxDepth: 1,
      key: 'office',
    });

    await officeProcessor.process(employees, 0);

    expect(employees[0].office).toEqual(office);
    expect(repositoryMock.getByIds).toHaveBeenCalledWith(new Set([2]));
  });

  it('should work for manager office', async () => {
    const employees = [
      {
        ...employee,
        manager: { ...manager },
      },
    ];

    const repositoryMock = new RepositoryMock();
    const officeProcessor = new OfficeProcessor(repositoryMock);

    officeProcessor.setup({
      data: {},
      maxDepth: 1,
      key: 'office',
    });

    await officeProcessor.process(employees, 1);

    expect(employees[0].office).toEqual(2);
    expect(employees[0].manager.office).toEqual(office);
  });

  it('should work not populate office info for manager', async () => {
    const employees = [
      {
        ...employee,
        manager: { ...manager },
      },
    ];

    const repositoryMock = new RepositoryMock();
    const officeProcessor = new OfficeProcessor(repositoryMock);

    officeProcessor.setup({
      data: {},
      maxDepth: 1,
      key: 'office',
    });

    await officeProcessor.process(employees, 0);

    expect(employees[0].office).toEqual(office);
    expect(employees[0].manager.office).toEqual(2);
  });
});
