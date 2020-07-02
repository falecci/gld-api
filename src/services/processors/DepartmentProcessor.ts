import { injectable, inject } from 'inversify';

import types from '../../config/types';
import IRepository from '../../interfaces/IRepository';
import BaseProcessor from './BaseProcessor';
import Department from '../../models/Department';
import Employee from '../../models/Employee';
import { Expand, ProcessorConfig } from '../../types';

@injectable()
class DepartmentProcessor extends BaseProcessor<
  Department | Employee,
  Department
> {
  protected _key: Expand;
  protected _missingIds: Set<number>;

  constructor(
    @inject(types.repositories.DepartmentRepository)
    protected _repository: IRepository<Department>,
  ) {
    super();
  }

  setup({
    key,
    data,
    maxDepth,
  }: ProcessorConfig<Department | Employee>): DepartmentProcessor {
    this._missingIds = new Set<number>();
    this._key = key;
    this._data = data;
    this._maxDepth = maxDepth;

    return this;
  }

  async process(
    data: Employee[] | Department[],
    managerDepth = 0,
    isEmployeeProcessing = false,
  ): Promise<void> {
    const getParentAndChild = this._makeGetParentAndChild(
      isEmployeeProcessing,
      managerDepth,
    );

    for (const item of data) {
      if (!isEmployeeProcessing) {
        this._addItemToMap(item as Department);
      }

      const { parent, child } = getParentAndChild(item);

      if (!parent || !child) {
        continue;
      }

      if (this._hasAlreadyProcessed(parent, child as Department)) {
        continue;
      }

      const replaced = this._replaceMissingDataWithExistingOne(
        parent,
        child as number,
      );

      if (replaced) {
        continue;
      }

      this._addMissingDataToList(child as number, parent);
    }

    if (this._missingIds.size) {
      await this._fetchAndReplaceMissingDepartments();
    }
  }

  private _fetchAndReplaceMissingDepartments = async () => {
    const departments = await this._repository.getByIds(this._missingIds);

    for (const department of departments) {
      this._data[department.id].name = department.name;
      this._data[department.id].superdepartment = department.superdepartment;
    }
  };

  private _makeGetParentAndChild = (
    isEmployeeProcessing: boolean,
    maxDepth: number,
  ) => {
    const getRecursiveItem = this._makeGetRecursiveItem();
    const getRecursiveManager = this._getMakeGetRecursiveItem(
      isEmployeeProcessing,
      maxDepth,
    );

    return (item): any => {
      if (!!maxDepth && isEmployeeProcessing) {
        const { child } = getRecursiveManager(item);

        const castedChild = child as Employee;

        if (!this._hasValidChild('department', castedChild)) {
          return {};
        }

        return getRecursiveItem(
          this._key === 'department'
            ? castedChild
            : (castedChild.department as Department),
        );
      }

      if (this._key === 'superdepartment') {
        const result = getRecursiveItem(item.department || item);

        const { child } = result;

        if (!this._hasValidChild(this._key, child as Department)) {
          return {};
        }

        return result;
      }

      return getRecursiveItem(item);
    };
  };

  private _hasValidChild = (
    key: 'superdepartment' | 'department',
    child: Employee | Department,
  ) => {
    if (!child || (typeof child !== 'number' && !child[key])) {
      return false;
    }

    return true;
  };

  private _getMakeGetRecursiveItem = (
    isEmployeeProcessing: boolean,
    managerDepth: number,
  ) => {
    if (isEmployeeProcessing && managerDepth) {
      return this._makeGetRecursiveItem('manager', managerDepth);
    }
    return null;
  };
}

export default DepartmentProcessor;
