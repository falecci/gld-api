import { ValidAny } from '../types';

export const isPropFilled = (prop: ValidAny): boolean =>
  hasProp(prop) && typeof prop !== 'number';

export const hasProp = (prop: ValidAny): boolean =>
  prop !== null && prop !== undefined;
