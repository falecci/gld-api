import { injectable, inject } from 'inversify';

import BaseProcessor from './BaseProcessor';
import Department from '../../models/Department';
import Employee from '../../models/Employee';
import IRepository from '../../interfaces/IRepository';
import Office from '../../models/Office';
import types from '../../config/types';
import { Expand, ProcessorConfig } from '../../types';
import { isPropFilled } from '../../utils';

@injectable()
class ManagerProcessor extends BaseProcessor<Employee> {
  protected readonly _key: Expand = 'manager';
  protected _missingIds: Set<number>;

  constructor(
    @inject(types.repositories.EmployeeRepository)
    protected _repository: IRepository<Employee>,
  ) {
    super();
  }

  setup({ data, maxDepth }: ProcessorConfig<Employee>): ManagerProcessor {
    this._missingIds = new Set<number>();
    this._data = data;
    this._maxDepth = maxDepth;

    return this;
  }

  async process(employees: Employee[]): Promise<void> {
    const getRecursiveItem = this._makeGetRecursiveItem();

    for (const employee of employees) {
      const mappedEmployee = {
        ...employee,
        department: this._getChildId(employee.department),
        office: this._getChildId(employee.office),
      };

      this._addItemToMap(mappedEmployee as Employee);

      const { parent, child } = getRecursiveItem(employee);

      if (this._hasAlreadyProcessed(parent, child)) {
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
      await this._fetchAndReplaceMissingManagers();
    }
  }

  private _fetchAndReplaceMissingManagers = async () => {
    const managers = await this._repository.getByIds(this._missingIds);

    for (const manager of managers) {
      this._data[manager.id].first = manager.first;
      this._data[manager.id].last = manager.last;
      this._data[manager.id].office = manager.office;
      this._data[manager.id].department = manager.department;
      this._data[manager.id].manager = manager.manager;
    }
  };

  private _getChildId<T extends Office | Department>(
    item: Office | Department | number,
  ): number | null {
    if (isPropFilled(item)) {
      return (item as T).id;
    }

    return item as number;
  }
}

export default ManagerProcessor;
