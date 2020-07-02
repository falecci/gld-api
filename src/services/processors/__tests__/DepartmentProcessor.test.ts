import 'reflect-metadata';

import DepartmentProcessor from '../DepartmentProcessor';
import IRepository from '../../../interfaces/IRepository';
import Department from '../../../models/Department';

afterEach(() => {
  jest.clearAllMocks();
});

describe('DepartmentProcessor', () => {
  describe('departments', () => {
    it('should use available data if possible', async () => {
      const superdepartment = {
        id: 6,
        name: 'Outbound Sales',
        superdepartment: 1,
      };

      const RepositoryMock = jest.fn<IRepository<Department>, []>(() => ({
        getAll: jest.fn(),
        getById: jest.fn(),
        getByIds: jest.fn(),
      }));
      const repositoryMock = new RepositoryMock();
      const departmentProcessor = new DepartmentProcessor(repositoryMock);
      departmentProcessor.setup({
        key: 'superdepartment',
        data: {
          6: superdepartment,
        },
        maxDepth: 1,
      });

      const departments = [
        {
          id: 9,
          name: 'Sales Development',
          superdepartment: 6,
        },
      ];

      await departmentProcessor.process(departments, 0, false);

      expect(departments[0].superdepartment).toEqual(superdepartment);
      expect(repositoryMock.getByIds).not.toHaveBeenCalled();
    });

    it('should work with 1 expand', async () => {
      const superdepartment = {
        id: 6,
        name: 'Outbound Sales',
        superdepartment: 1,
      };

      const RepositoryMock = jest.fn<IRepository<Department>, []>(() => ({
        getAll: jest.fn(),
        getById: jest.fn(),
        getByIds: jest.fn(() => Promise.resolve([superdepartment])),
      }));
      const repositoryMock = new RepositoryMock();
      const departmentProcessor = new DepartmentProcessor(repositoryMock);
      departmentProcessor.setup({
        key: 'superdepartment',
        data: {},
        maxDepth: 1,
      });

      const departments = [
        {
          id: 9,
          name: 'Sales Development',
          superdepartment: 6,
        },
      ];

      await departmentProcessor.process(departments, 0, false);

      expect(departments[0].superdepartment).toEqual(superdepartment);
      expect(repositoryMock.getByIds).toHaveBeenCalledWith(new Set([6]));
    });

    it('should work with 2 expand', async () => {
      const superdepartment = {
        id: 1,
        name: 'Sales',
        superdepartment: null,
      };

      const RepositoryMock = jest.fn<IRepository<Department>, []>(() => ({
        getAll: jest.fn(),
        getById: jest.fn(),
        getByIds: jest.fn(() => Promise.resolve([superdepartment])),
      }));

      const repositoryMock = new RepositoryMock();
      const departmentProcessor = new DepartmentProcessor(repositoryMock);
      departmentProcessor.setup({
        key: 'superdepartment',
        data: {},
        maxDepth: 2,
      });

      const departments = [
        {
          id: 9,
          name: 'Sales Development',
          superdepartment: {
            id: 6,
            name: 'Outbound Sales',
            superdepartment: 1,
          },
        },
      ];

      await departmentProcessor.process(departments, 0, false);

      expect(departments[0].superdepartment.superdepartment).toEqual(
        superdepartment,
      );
      expect(repositoryMock.getByIds).toHaveBeenCalledWith(new Set([1]));
    });
  });

  describe('employees', () => {
    it('should work with department', async () => {
      const department = {
        id: 5,
        name: 'Inbound Sales',
        superdepartment: 1,
      };

      const RepositoryMock = jest.fn<IRepository<Department>, []>(() => ({
        getAll: jest.fn(),
        getById: jest.fn(),
        getByIds: jest.fn(() => Promise.resolve([department])),
      }));
      const repositoryMock = new RepositoryMock();
      const departmentProcessor = new DepartmentProcessor(repositoryMock);
      departmentProcessor.setup({
        key: 'department',
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

      await departmentProcessor.process(employees, 0, true);

      expect(employees[0].department).toEqual(department);
      expect(repositoryMock.getByIds).toHaveBeenCalledWith(new Set([5]));
    });

    it('should work for employee department.superdepartment ', async () => {
      const superdepartment = {
        id: 1,
        name: 'Sales',
        superdepartment: null,
      };

      const RepositoryMock = jest.fn<IRepository<Department>, []>(() => ({
        getAll: jest.fn(),
        getById: jest.fn(),
        getByIds: jest.fn(() => Promise.resolve([superdepartment])),
      }));
      const repositoryMock = new RepositoryMock();
      const departmentProcessor = new DepartmentProcessor(repositoryMock);
      departmentProcessor.setup({
        key: 'superdepartment',
        data: {},
        maxDepth: 1,
      });

      const employees = [
        {
          first: 'Daniel',
          last: 'Smith',
          id: 2,
          manager: 1,
          department: {
            id: 5,
            name: 'Inbound Sales',
            superdepartment: 1,
          },
          office: 2,
        },
      ];

      await departmentProcessor.process(employees, 0, true);

      expect(employees[0].department.superdepartment).toEqual(superdepartment);
      expect(repositoryMock.getByIds).toHaveBeenCalledWith(new Set([1]));
    });

    it('should work for employee manager.department', async () => {
      const department = {
        id: 5,
        name: 'Inbound Sales',
        superdepartment: 1,
      };

      const RepositoryMock = jest.fn<IRepository<Department>, []>(() => ({
        getAll: jest.fn(),
        getById: jest.fn(),
        getByIds: jest.fn(() => Promise.resolve([department])),
      }));
      const repositoryMock = new RepositoryMock();
      const departmentProcessor = new DepartmentProcessor(repositoryMock);
      departmentProcessor.setup({
        key: 'department',
        data: {},
        maxDepth: 1,
      });

      const employees = [
        {
          first: 'Daniel',
          last: 'Smith',
          id: 2,
          manager: {
            department: 5,
            first: 'Patricia',
            last: 'Diaz',
            id: 1,
            manager: null,
            office: 2,
          },
          department: 5,
          office: 2,
        },
      ];

      await departmentProcessor.process(employees, 1, true);

      expect(employees[0].manager.department).toEqual(department);
      expect(employees[0].department).toEqual(department.id);
      expect(repositoryMock.getByIds).toHaveBeenCalledWith(new Set([5]));
    });

    it('should work for employee manager.department.superdepartment', async () => {
      const superdepartment = {
        id: 1,
        name: 'Sales',
        superdepartment: null,
      };

      const RepositoryMock = jest.fn<IRepository<Department>, []>(() => ({
        getAll: jest.fn(),
        getById: jest.fn(),
        getByIds: jest.fn(() => Promise.resolve([superdepartment])),
      }));
      const repositoryMock = new RepositoryMock();
      const departmentProcessor = new DepartmentProcessor(repositoryMock);
      departmentProcessor.setup({
        key: 'superdepartment',
        data: {},
        maxDepth: 1,
      });

      const employees = [
        {
          first: 'Daniel',
          last: 'Smith',
          id: 2,
          manager: {
            id: 1,
            first: 'Patricia',
            last: 'Diaz',
            office: 2,
            department: {
              id: 5,
              name: 'Inbound Sales',
              superdepartment: 1,
            },
            manager: null,
          },
          department: 5,
          office: 2,
        },
      ];

      await departmentProcessor.process(employees, 1, true);

      expect(employees[0].manager.department.superdepartment).toEqual(
        superdepartment,
      );
      expect(repositoryMock.getByIds).toHaveBeenCalledWith(new Set([1]));
    });
  });
});
