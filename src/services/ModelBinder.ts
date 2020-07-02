import ExpandsLinkedList from '../models/Expands';
import { Expand, ValidAny } from '../types';
import {
  VALID_EXPANDS,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  DEFAULT_OFFSET,
} from '../constants';

type IntegerParamaterValidation = {
  key: string;
  value: ValidAny;
  defaultValue: number;
  min: number;
  max?: number;
};

type Pagination = {
  limit: number;
  offset: number;
};

export class ValidationError extends Error {}

export default abstract class ModelBinder {
  static parseId(value: ValidAny): number {
    if (!value) {
      throw new ValidationError('Id parameter is required');
    }

    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
      throw new ValidationError(`Invalid id parameter value: ${value}`);
    }

    return parsed;
  }

  static parseLimitAndOffset(queryString: ValidAny): Pagination {
    const limit = this._getAndValidateIntegerParam({
      key: 'limit',
      value: queryString.limit,
      min: 1,
      max: MAX_LIMIT,
      defaultValue: DEFAULT_LIMIT,
    });

    const offset = this._getAndValidateIntegerParam({
      key: 'offset',
      value: queryString.offset,
      min: 0,
      defaultValue: DEFAULT_OFFSET,
    });

    return { limit, offset };
  }

  static parseExpands(entity: Expand, payload: ValidAny): ExpandsLinkedList {
    return this._getAndValidateExpandParam(entity, payload);
  }

  private static _getAndValidateIntegerParam({
    defaultValue,
    key,
    min,
    value,
    max,
  }: IntegerParamaterValidation) {
    let parsed = defaultValue;

    if (value) {
      parsed = Number(value);

      if (Number.isNaN(parsed) || parsed < min || (max && parsed > max)) {
        throw new ValidationError(`Invalid ${key} parameter value: ${value}`);
      }
    }

    return parsed;
  }

  private static _getAndValidateExpandParam(entity: Expand, value: ValidAny) {
    if (!value || entity === 'office') {
      return;
    }

    if (typeof value !== 'string' && !Array.isArray(value)) {
      throw new ValidationError(
        `Invalid type for expand parameter: ${typeof value}`,
      );
    }

    if (typeof value === 'string') {
      return this._getAndValidateExpandList(entity, value);
    }

    const firstGroup = value.shift();
    let expands = this._getAndValidateExpandList(entity, firstGroup);

    value.forEach((expandGroup) => {
      expands = this._getAndValidateExpandList(entity, expandGroup, expands);
    });

    return expands;
  }

  private static _getAndValidateExpandList(
    entity: Expand,
    value: ValidAny,
    list?: ExpandsLinkedList,
  ) {
    if (typeof value !== 'string') {
      throw new ValidationError(
        `Invalid type for expand parameter: ${typeof value}`,
      );
    }

    const expands = value.split('.');
    const firstExpand = expands.shift() as Expand;

    this._validateExpand(entity, firstExpand);

    const result = list || new ExpandsLinkedList(firstExpand);

    if (list) {
      result.insert(firstExpand);
    }

    expands.forEach((e: Expand) => result.append(e));
    return result;
  }

  private static _validateExpand(entity: Expand, value: string): void {
    if (!VALID_EXPANDS.includes(value)) {
      throw new ValidationError(
        `Invalid expand value: ${value}. Allowed values are: ${VALID_EXPANDS.join()}`,
      );
    }

    if (entity === 'manager' && value === 'superdepartment') {
      throw new ValidationError(
        `supertdepartment is not a valid expand for Employee. Allowed expands: ['department', 'office', 'manager']`,
      );
    }

    if (entity === 'department' && value !== 'superdepartment') {
      throw new ValidationError(
        `Invalid expand: ${value} for department. Allowed expands: 'superdepartment'`,
      );
    }
  }
}
