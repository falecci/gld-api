import { injectable } from 'inversify';

import IRepository from '../interfaces/IRepository';
import Employee from '../models/Employee';

@injectable()
class EmployeeRepository implements IRepository<Employee> {
  private readonly _endpoint;

  constructor() {
    this._endpoint = `${process.env.GLIDE_API_ENDPOINT}/employees`;
  }

  async getById(id: number): Promise<Employee> {
    const result = await this._fetchEmployees(`id=${id}`);

    return result[0];
  }

  getByIds(ids: Set<number>): Promise<Employee[]> {
    return this._fetchEmployees(`id=${Array.from(ids).join('&id=')}`);
  }

  getAll(limit: number, offset: number): Promise<Employee[]> {
    return this._fetchEmployees(`offset=${offset}&limit=${limit}`);
  }

  private async _fetchEmployees<T extends Employee | Employee[]>(
    queryString: string,
  ): Promise<T> {
    const request = await fetch(`${this._endpoint}?${queryString}`, {
      mode: 'cors',
    });
    const response = (await request.json()) as T;

    return response;
  }
}

export default EmployeeRepository;
