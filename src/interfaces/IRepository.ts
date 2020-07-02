import Department from '../models/Department';
import Employee from '../models/Employee';
import Office from '../models/Office';

interface IRepository<T extends Department | Office | Employee> {
  getById(id: number): Promise<T>;
  getByIds(ids: Set<number>): Promise<T[]>;
  getAll(limit: number, offset: number): Promise<T[]>;
}

export default IRepository;
