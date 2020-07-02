import 'reflect-metadata';
import { Container, interfaces } from 'inversify';

import Department from '../models/Department';
import DepartmentJSONRepository from '../repositories/DepartmentJSONRepository';
import DepartmentProcessor from '../services/processors/DepartmentProcessor';
import DepartmentService from '../services/DepartmentService';
import Employee from '../models/Employee';
import EmployeeRepository from '../repositories/EmployeeRepository';
import EmployeeService from '../services/EmployeeService';
import IProcessor from '../interfaces/IProcessor';
import IRepository from '../interfaces/IRepository';
import ManagerProcessor from '../services/processors/ManagerProcessor';
import Office from '../models/Office';
import OfficeJSONRepository from '../repositories/OfficeJSONRepository';
import OfficeProcessor from '../services/processors/OfficeProcessor';
import OfficeService from '../services/OfficeService';
import types from './types';
import { ProcessorConfig } from '../types';

const container = new Container();

container
  .bind<IProcessor>(types.processors.IProcessor)
  .to(OfficeProcessor)
  .whenTargetNamed('office');

container
  .bind<IProcessor>(types.processors.IProcessor)
  .to(ManagerProcessor)
  .whenTargetNamed('manager');

container
  .bind<IProcessor>(types.processors.IProcessor)
  .to(DepartmentProcessor)
  .whenTargetNamed('department');

container
  .bind<IProcessor>(types.processors.IProcessor)
  .to(DepartmentProcessor)
  .whenTargetNamed('superdepartment');

container
  .bind<IProcessor>(types.processors.ProcessorFactory)
  .toFactory<IProcessor>((context: interfaces.Context) => {
    return <T>(config: ProcessorConfig<T>) => {
      const processor = context.container.getNamed<IProcessor>(
        types.processors.IProcessor,
        config.key,
      );
      return processor.setup(config);
    };
  });

container
  .bind<IRepository<Office>>(types.repositories.OfficeRepository)
  .to(OfficeJSONRepository);

container
  .bind<IRepository<Department>>(types.repositories.DepartmentRepository)
  .to(DepartmentJSONRepository);

container
  .bind<IRepository<Employee>>(types.repositories.EmployeeRepository)
  .to(EmployeeRepository);

container.bind<OfficeService>(types.services.OfficeService).to(OfficeService);

container
  .bind<DepartmentService>(types.services.DepartmentService)
  .to(DepartmentService);

container
  .bind<EmployeeService>(types.services.EmployeeService)
  .to(EmployeeService);

export default container;
