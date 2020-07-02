import Department from './Department';
import IEntity from '../interfaces/IEntity';
import Office from './Office';
import { IntReference } from '../types';

export default class Employee implements IEntity {
  readonly id: number;
  first: string;
  last: string;
  manager?: IntReference<Employee>;
  department: IntReference<Department>;
  office: IntReference<Office>;

  constructor(
    id: number,
    first: string,
    last: string,
    department: IntReference<Department>,
    office: IntReference<Office>,
    manager?: IntReference<Employee>,
  ) {
    this.id = id;
    this.first = first;
    this.last = last;
    this.manager = manager;
    this.department = department;
    this.office = office;
  }
}
