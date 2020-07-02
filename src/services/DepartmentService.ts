import { inject, injectable } from 'inversify';

import Department from '../models/Department';
import ExpandsLinkedList from '../models/Expands';
import IRepository from '../interfaces/IRepository';
import types from '../config/types';
import IProcessor from '../interfaces/IProcessor';
import { ProcessorConfig } from '../types';

@injectable()
class DepartmentService {
  constructor(
    @inject(types.processors.ProcessorFactory)
    private readonly _processorFactory: (
      config: ProcessorConfig<Department>,
    ) => IProcessor<Department>,

    @inject(types.repositories.DepartmentRepository)
    private readonly _departmentRepository: IRepository<Department>,
  ) {}

  async getById(id: number, expands?: ExpandsLinkedList): Promise<Department> {
    const department = await this._departmentRepository.getById(id);

    if (!expands || (expands && expands.size === 0)) {
      return department;
    }

    return (await this._enrichDepartmentInfo([department], expands))[0];
  }

  async getAll(
    limit: number,
    offset: number,
    expands?: ExpandsLinkedList,
  ): Promise<Department[]> {
    const departments = await this._departmentRepository.getAll(limit, offset);

    if (!expands || (expands && expands.size === 0)) {
      return departments;
    }

    return await this._enrichDepartmentInfo(departments, expands);
  }

  private async _enrichDepartmentInfo(
    data: Department[],
    expands: ExpandsLinkedList,
  ) {
    const departments: Record<number, Partial<Department>> = {};

    let currentExpand = expands.shift();

    while (currentExpand) {
      const currentExpandValue = currentExpand.value;

      const departmentProcessor = this._processorFactory({
        data: departments,
        maxDepth: currentExpand.nestedCount,
        key: currentExpandValue,
      });

      await departmentProcessor.process(data);

      currentExpand = expands.shift();
    }

    return data;
  }
}

export default DepartmentService;
