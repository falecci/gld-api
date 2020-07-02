import { Expand } from '../types';

class ExpandNode {
  readonly value: Expand;
  next: ExpandNode;
  previous?: ExpandNode;
  nestedCount: number;
  nestedManagerCount: number;

  constructor(value: Expand) {
    this.value = value;
    this.next = null;
    this.previous = null;
    this.nestedCount = 1;
    this.nestedManagerCount = value === 'manager' ? 1 : 0;
  }
}

class ExpandsLinkedList {
  private _head: ExpandNode;
  private _tail: ExpandNode;
  private _size: number;

  constructor(initialValue: Expand) {
    if (!initialValue) {
      throw new Error('You need an initial expand node');
    }

    this._head = new ExpandNode(initialValue);
    this._tail = this._head;
    this._size = 1;
  }

  insert(value: Expand): void {
    const newExpand = new ExpandNode(value);
    const lastTail = this._tail;
    this._tail = newExpand;
    lastTail.next = this._tail;
    this._size++;
  }

  append(value: Expand): void {
    this._validateNestedRelationship(this._tail.value, value);

    const newExpand = new ExpandNode(value);
    const lastTail = this._tail;

    this._tail = newExpand;
    lastTail.next = this._tail;

    this._tail.previous = lastTail;
    this._size++;
    this._countNestedRelationship(lastTail, this._tail);
  }

  shift(): ExpandNode {
    const oldHead = this._head;

    if (oldHead) {
      this._head = oldHead.next;
      this._size--;
    }

    return oldHead;
  }

  get size(): number {
    return this._size;
  }

  private _countNestedRelationship(previous: ExpandNode, next: ExpandNode) {
    if (previous.value === next.value) {
      next.nestedCount = previous.nestedCount + 1;
      next.nestedManagerCount = previous.nestedManagerCount;
      return;
    }

    if (previous.value === 'manager') {
      next.nestedManagerCount = previous.nestedCount;
      return;
    }

    if (!!previous.nestedManagerCount) {
      next.nestedManagerCount = previous.nestedManagerCount;
      return;
    }
  }

  private _validateNestedRelationship(previous: Expand, next: Expand) {
    if (
      previous === 'manager' &&
      ['manager', 'department', 'office'].includes(next)
    ) {
      return;
    }

    if (
      ['department', 'superdepartment'].includes(previous) &&
      next === 'superdepartment'
    ) {
      return;
    }

    throw new Error(
      `Invalid nested relationship within ${previous} and ${next}`,
    );
  }
}

export default ExpandsLinkedList;
