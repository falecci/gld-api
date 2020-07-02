const types = {
  repositories: {
    IRepository: Symbol.for('IRepository'),
    DepartmentRepository: Symbol.for('DepartmentRepository'),
    EmployeeRepository: Symbol.for('EmployeeRepository'),
    OfficeRepository: Symbol.for('OfficeRepository'),
  },
  services: {
    DepartmentService: Symbol.for('DepartmentService'),
    EmployeeService: Symbol.for('EmployeeService'),
    OfficeService: Symbol.for('OfficeService'),
  },
  processors: {
    IProcessor: Symbol.for('IProcessor'),
    ProcessorFactory: Symbol.for('ProcessorFactory'),
    DepartmentProcessor: Symbol.for('DepartmentProcessor'),
    ManagerProcessor: Symbol.for('ManagerProcessor'),
    OfficeProcessor: Symbol.for('OfficeProcessor'),
  },
};

export default types;
