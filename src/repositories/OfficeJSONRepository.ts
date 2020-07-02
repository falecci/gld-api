import { injectable } from 'inversify';

import * as Offices from '../data/offices.json';
import BaseRepository from './BaseJSONRepository';
import Office from '../models/Office';

@injectable()
class OfficeJSONRepository extends BaseRepository<Office> {
  protected readonly _data: Record<number, Office> = {};

  constructor() {
    super();
    Offices.forEach(
      ({ id, address, city, country }) =>
        (this._data[id] =
          this._data[id] || new Office(id, city, country, address)),
    );
  }
}

export default OfficeJSONRepository;
