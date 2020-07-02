import IEntity from '../interfaces/IEntity';
import { IntReference } from '../types';

export default class Department implements IEntity {
  readonly id: number;
  name: string;
  superdepartment?: IntReference<Department>;

  constructor(
    id: number,
    name: string,
    superdepartment?: IntReference<Department>,
  ) {
    this.id = id;
    this.name = name;
    this.superdepartment = superdepartment;
  }
}
