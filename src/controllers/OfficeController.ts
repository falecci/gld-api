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

import OfficeService from '../services/OfficeService';
import Office from '../models/Office';
import types from '../config/types';
import ModelBinder, { ValidationError } from '../services/ModelBinder';

@controller('/offices')
export class OfficeController extends BaseHttpController {
  constructor(
    @inject(types.services.OfficeService) private _service: OfficeService,
  ) {
    super();
  }

  @httpGet('/')
  public async getAll(
    req: Request,
  ): Promise<Office[] | BadRequestErrorMessageResult> {
    try {
      const { limit, offset } = ModelBinder.parseLimitAndOffset(req.query);

      return await this._service.getAll(limit, offset);
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
  ): Promise<Office | NotFoundResult | BadRequestErrorMessageResult> {
    try {
      const result = await this._service.getById(
        ModelBinder.parseId(req.params.id),
      );

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
