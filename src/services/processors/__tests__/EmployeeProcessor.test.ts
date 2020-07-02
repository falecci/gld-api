import 'reflect-metadata';

import ManagerProcessor from '../ManagerProcessor';
import IRepository from '../../../interfaces/IRepository';
import Employee from '../../../models/Employee';

afterEach(() => {
  jest.clearAllMocks();
});

describe('ManagerProcessor', () => {
  it('should use existing data if available', async () => {
    const manager = {
      first: 'Patricia',
      last: 'Diaz',
      id: 1,
      manager: null,
      department: 5,
      office: 2,
    };
    const RepositoryMock = jest.fn<IRepository<Employee>, []>(() => ({
      getAll: jest.fn(),
      getById: jest.fn(),
      getByIds: jest.fn(),
    }));
    const repositoryMock = new RepositoryMock();
    const managerProcessor = new ManagerProcessor(repositoryMock);
    managerProcessor.setup({
      key: 'manager',
      data: {
        1: manager,
      },
      maxDepth: 1,
    });

    const employees = [
      {
        first: 'Daniel',
        last: 'Smith',
        id: 2,
        manager: 1,
        department: 5,
        office: 2,
      },
    ];

    await managerProcessor.process(employees);

    expect(employees[0].manager).toEqual(manager);
    expect(repositoryMock.getByIds).not.toHaveBeenCalled();
  });

  it('should work with 2 expand', async () => {
    const manager = {
      first: 'Ruth',
      last: 'Morgan',
      id: 4,
      manager: null,
      department: 6,
      office: 2,
    };
    const RepositoryMock = jest.fn<IRepository<Employee>, []>(() => ({
      getAll: jest.fn(),
      getById: jest.fn(),
      getByIds: jest.fn(() => Promise.resolve([manager])),
    }));
    const repositoryMock = new RepositoryMock();
    const managerProcessor = new ManagerProcessor(repositoryMock);
    managerProcessor.setup({
      key: 'manager',
      data: {},
      maxDepth: 2,
    });

    const employees = [
      {
        first: 'Dorothy',
        last: 'Baker',
        id: 8,
        manager: {
          first: 'Daniel',
          last: 'Phillips',
          id: 6,
          manager: 4,
          department: 4,
          office: 1,
        },
        department: null,
        office: 5,
      },
    ];

    await managerProcessor.process(employees);

    expect(employees[0].manager.manager).toEqual(manager);
    expect(repositoryMock.getByIds).toHaveBeenCalledWith(new Set([4]));
  });

  it('should work with 1 expand', async () => {
    const manager = {
      first: 'Patricia',
      last: 'Diaz',
      id: 1,
      manager: null,
      department: 5,
      office: 2,
    };
    const RepositoryMock = jest.fn<IRepository<Employee>, []>(() => ({
      getAll: jest.fn(),
      getById: jest.fn(),
      getByIds: jest.fn(() => Promise.resolve([manager])),
    }));
    const repositoryMock = new RepositoryMock();
    const managerProcessor = new ManagerProcessor(repositoryMock);
    managerProcessor.setup({
      key: 'manager',
      data: {},
      maxDepth: 1,
    });

    const employees = [
      {
        first: 'Daniel',
        last: 'Smith',
        id: 2,
        manager: 1,
        department: 5,
        office: 2,
      },
    ];

    await managerProcessor.process(employees);

    expect(employees[0].manager).toEqual(manager);
    expect(repositoryMock.getByIds).toHaveBeenCalledWith(new Set([1]));
  });

  it('should work with 2 expand', async () => {
    const manager = {
      first: 'Ruth',
      last: 'Morgan',
      id: 4,
      manager: null,
      department: 6,
      office: 2,
    };
    const RepositoryMock = jest.fn<IRepository<Employee>, []>(() => ({
      getAll: jest.fn(),
      getById: jest.fn(),
      getByIds: jest.fn(() => Promise.resolve([manager])),
    }));
    const repositoryMock = new RepositoryMock();
    const managerProcessor = new ManagerProcessor(repositoryMock);
    managerProcessor.setup({
      key: 'manager',
      data: {},
      maxDepth: 2,
    });

    const employees = [
      {
        first: 'Dorothy',
        last: 'Baker',
        id: 8,
        manager: {
          first: 'Daniel',
          last: 'Phillips',
          id: 6,
          manager: 4,
          department: 4,
          office: 1,
        },
        department: null,
        office: 5,
      },
    ];

    await managerProcessor.process(employees);

    expect(employees[0].manager.manager).toEqual(manager);
    expect(repositoryMock.getByIds).toHaveBeenCalledWith(new Set([4]));
  });
});
