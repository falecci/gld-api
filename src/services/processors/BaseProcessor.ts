import { injectable } from 'inversify';

import Department from '../../models/Department';
import Employee from '../../models/Employee';
import IProcessor from '../../interfaces/IProcessor';
import Office from '../../models/Office';
import { Expand, ValidAny, ProcessorConfig } from '../../types';
import { isPropFilled, hasProp } from '../../utils';

type RecursiveItem<T> = { parent: T; child: T | number };

@injectable()
abstract class BaseProcessor<
  TEntity extends Employee | Department | Office,
  TData extends Employee | Department | Office = TEntity
> implements IProcessor<TEntity> {
  protected abstract readonly _key: Expand;
  protected readonly _missingIds: Set<number>;

  protected _maxDepth: number;
  protected _data: Record<number, Partial<TData>>;

  abstract process(data: TEntity[], ...args: ValidAny[]): Promise<void>;
  abstract setup(config: ProcessorConfig<TEntity>): IProcessor<TEntity>;

  protected _addItemToMap = (item: TData): void => {
    if (!this._data[item.id]) {
      this._data[item.id] = item;
    }
  };

  protected _replaceMissingDataWithExistingOne = (
    parent: TEntity,
    child: number,
  ): boolean => {
    const parentChild = this._data[child];

    if (!parentChild || Object.keys(parentChild).length === 1) {
      return false;
    }

    const nextManager = isPropFilled(parentChild[this._key])
      ? (parentChild[this._key] as TEntity).id
      : parentChild[this._key];

    parent[this._key] = {
      ...parentChild,
      [this._key]: nextManager,
    };

    return true;
  };

  protected _addMissingDataToList(id: number, item: TEntity): void {
    const placeholder = { id } as TData;
    this._data[id] = this._data[id] || placeholder;
    item[this._key] = this._data[id];
    this._missingIds.add(id);
  }

  protected _hasAlreadyProcessed(
    parent: TEntity,
    child: TData | number,
  ): boolean {
    return !hasProp(parent) || !hasProp(child) || isPropFilled(child);
  }

  protected _makeGetRecursiveItem = (
    customKey?: Expand,
    customDepth?: number,
  ): ((item: TEntity, currentDepth?: number) => RecursiveItem<TEntity>) => {
    const key = customKey || this._key;
    const maxDepth = customDepth || this._maxDepth;

    return function getRecursiveItem(
      item: TEntity,
      currentDepth = 1,
    ): RecursiveItem<TEntity> {
      if (currentDepth === maxDepth || !hasProp(item[key])) {
        return { parent: item, child: item[key] };
      }

      return getRecursiveItem(item[key], currentDepth + 1);
    };
  };
}

export default BaseProcessor;
