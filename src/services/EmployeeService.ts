import { injectable, inject } from 'inversify';

import Department from '../models/Department';
import Employee from '../models/Employee';
import ExpandsLinkedList from '../models/Expands';
import IProcessor from '../interfaces/IProcessor';
import IRepository from '../interfaces/IRepository';
import Office from '../models/Office';
import types from '../config/types';
import { Expand, ProcessorConfig } from '../types';

@injectable()
class EmployeeService {
  constructor(
    @inject(types.processors.ProcessorFactory)
    private readonly _processorFactory: (
      config: ProcessorConfig<Employee | Department | Office>,
    ) => IProcessor,

    @inject(types.repositories.EmployeeRepository)
    private readonly _employeeRepository: IRepository<Employee>,
  ) {}

  async getById(id: number, expands?: ExpandsLinkedList): Promise<Employee> {
    const employee = await this._employeeRepository.getById(id);

    if (!expands || (expands && expands.size === 0) || !employee) {
      return employee;
    }

    return (await this._enrichEmployeeData([employee], expands))[0];
  }

  async getAll(
    limit: number,
    offset: number,
    expands?: ExpandsLinkedList,
  ): Promise<Employee[]> {
    const data = await this._employeeRepository.getAll(limit, offset);

    if (!expands || (expands && expands.size === 0)) {
      return data;
    }

    return await this._enrichEmployeeData(data, expands);
  }

  private async _enrichEmployeeData(
    data: Employee[],
    expands: ExpandsLinkedList,
  ): Promise<Employee[]> {
    const usedData: Record<string, Record<number, any>> = {};

    let expand = expands.shift();

    while (expand) {
      const expandValue = expand.value;
      const whackyHack: Expand =
        expandValue === 'superdepartment' ? 'department' : expandValue;

      const currentData = usedData[whackyHack] || {};

      const processor = this._processorFactory({
        data: currentData,
        key: expandValue,
        maxDepth:
          expandValue === 'office'
            ? expand.nestedManagerCount
            : expand.nestedCount,
      });

      await processor.process(data, expand.nestedManagerCount, true);

      expand = expands.shift();
    }

    return data;
  }
}

export default EmployeeService;
