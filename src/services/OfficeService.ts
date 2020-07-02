import { inject, injectable } from 'inversify';

import IRepository from '../interfaces/IRepository';
import Office from '../models/Office';
import types from '../config/types';

@injectable()
class OfficeService {
  constructor(
    @inject(types.repositories.OfficeRepository)
    private readonly _officeRepository: IRepository<Office>,
  ) {}

  async getById(id: number): Promise<Office> {
    return await this._officeRepository.getById(id);
  }

  async getAll(limit: number, offset: number): Promise<Office[]> {
    return await this._officeRepository.getAll(limit, offset);
  }
}

export default OfficeService;
