import { injectable, inject } from 'inversify';

import BaseProcessor from './BaseProcessor';
import Employee from '../../models/Employee';
import IRepository from '../../interfaces/IRepository';
import Office from '../../models/Office';
import types from '../../config/types';
import { Expand, ProcessorConfig } from '../../types';

@injectable()
class OfficeProcessor extends BaseProcessor<Employee, Office> {
  protected _key: Expand = 'office';
  protected _missingIds: Set<number>;

  constructor(
    @inject(types.repositories.OfficeRepository)
    protected _repository: IRepository<Office>,
  ) {
    super();
  }

  setup({ data, maxDepth }: ProcessorConfig<Employee>): OfficeProcessor {
    this._missingIds = new Set<number>();
    this._data = data;
    this._maxDepth = maxDepth;

    return this;
  }

  async process(employees: Employee[], managerDepth: number): Promise<void> {
    const getRecursiveItem = this._makeGetRecursiveItem(
      'manager',
      managerDepth,
    );

    for (const employee of employees) {
      let currEmployee = employee;

      if (!!managerDepth) {
        const { child } = getRecursiveItem(employee);
        currEmployee = child as Employee;
      }

      if (!currEmployee || !currEmployee.office) {
        continue;
      }

      if (this._hasAlreadyProcessed(currEmployee, currEmployee.office)) {
        continue;
      }
      const replaced = this._replaceMissingDataWithExistingOne(
        currEmployee,
        currEmployee.office as number,
      );

      if (replaced) {
        continue;
      }

      this._addMissingDataToList(currEmployee.office as number, currEmployee);
    }

    if (this._missingIds.size) {
      await this._fetchAndReplaceMissingOffices();
    }
  }

  private _fetchAndReplaceMissingOffices = async () => {
    const offices = await this._repository.getByIds(this._missingIds);

    for (const office of offices) {
      this._data[office.id].address = office.address;
      this._data[office.id].city = office.city;
      this._data[office.id].country = office.country;
    }
  };
}

export default OfficeProcessor;
