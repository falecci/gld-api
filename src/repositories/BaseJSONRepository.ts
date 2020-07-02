import { injectable } from 'inversify';

import Department from '../models/Department';
import IRepository from '../interfaces/IRepository';
import Office from '../models/Office';

@injectable()
abstract class BaseRepository<T extends Office | Department>
  implements IRepository<T> {
  protected readonly _data: Record<number, T> = {};

  getById(id: number): Promise<T> {
    return new Promise((resolve) => resolve(this._data[id]));
  }

  getAll(limit: number, offset: number): Promise<T[]> {
    return new Promise((resolve) =>
      resolve(
        Object.values(this._data).slice(offset * limit, limit * offset + limit),
      ),
    );
  }

  async getByIds(ids: Set<number>): Promise<T[]> {
    return new Promise((resolve) =>
      resolve(
        Object.values(this._data).filter((item) =>
          Array.from(ids).includes(item.id),
        ),
      ),
    );
  }
}

export default BaseRepository;
