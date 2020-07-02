import { injectable } from 'inversify';

import * as Departments from '../data/departments.json';
import BaseRepository from './BaseJSONRepository';
import Department from '../models/Department';

@injectable()
class DepartmentRepository extends BaseRepository<Department> {
  protected readonly _data: Record<number, Department> = {};

  constructor() {
    super();
    Departments.forEach(
      ({ id, name, superdepartment }) =>
        (this._data[id] =
          this._data[id] || new Department(id, name, superdepartment)),
    );
  }
}

export default DepartmentRepository;
