import { Request } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  BaseHttpController,
} from 'inversify-express-utils';
import {
  NotFoundResult,
  BadRequestErrorMessageResult,
} from 'inversify-express-utils/dts/results';

import Employee from '../models/Employee';
import EmployeeService from '../services/EmployeeService';
import ModelBinder, { ValidationError } from '../services/ModelBinder';
import types from '../config/types';
import { Expand } from '../types';

@controller('/employees')
export class EmployeeController extends BaseHttpController {
  private readonly _key: Expand = 'manager';

  constructor(
    @inject(types.services.EmployeeService)
    private _service: EmployeeService,
  ) {
    super();
  }

  @httpGet('/')
  public async getAll(
    req: Request,
  ): Promise<Employee[] | BadRequestErrorMessageResult> {
    try {
      const { limit, offset } = ModelBinder.parseLimitAndOffset(req.query);
      const expands = ModelBinder.parseExpands(this._key, req.query.expand);

      return await this._service.getAll(limit, offset, expands);
    } catch (err) {
      if (err instanceof ValidationError) {
        return this.badRequest(err.message);
      }

      throw err;
    }
  }

  @httpGet('/:id')
  public async get(
    req: Request,
  ): Promise<Employee | NotFoundResult | BadRequestErrorMessageResult> {
    try {
      const id = ModelBinder.parseId(req.params.id);
      const expands = ModelBinder.parseExpands(this._key, req.query.expand);

      const result = await this._service.getById(id, expands);

      if (!result) {
        return this.notFound();
      }

      return result;
    } catch (err) {
      if (err instanceof ValidationError) {
        return this.badRequest(err.message);
      }

      throw err;
    }
  }
}
