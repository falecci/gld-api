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

import Department from '../models/Department';
import DepartmentService from '../services/DepartmentService';
import types from '../config/types';
import ModelBinder, { ValidationError } from '../services/ModelBinder';
import { Expand } from '../types';

@controller('/departments')
export class DepartmentController extends BaseHttpController {
  private readonly _key: Expand = 'department';

  constructor(
    @inject(types.services.DepartmentService)
    private _service: DepartmentService,
  ) {
    super();
  }

  @httpGet('/')
  public async getAll(
    req: Request,
  ): Promise<Department[] | BadRequestErrorMessageResult> {
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
  ): Promise<Department | NotFoundResult | BadRequestErrorMessageResult> {
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
