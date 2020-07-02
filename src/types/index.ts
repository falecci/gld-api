export type IntReference<T> = number | T;

export type Expand = 'manager' | 'department' | 'superdepartment' | 'office';

export type ValidAny = any;

export type ProcessorConfig<T> = {
  data: Record<number, Partial<T>>;
  maxDepth: number;
  key?: Expand;
};
