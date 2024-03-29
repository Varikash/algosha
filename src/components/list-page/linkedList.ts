class LinkedListNode<T> {
  value: T;
  next: LinkedListNode<T> | null;
  constructor(value: T, next: LinkedListNode<T> | null = null) {
    this.value = value;
    this.next = next;
  }
}

interface TLinkedList<T> {
  [Symbol.iterator](): Iterator<T>;
  prepend(value: T): void;
  append(value: T): void;
  addByIndex(value: T, index: number): void;
  deleteByIndex(index: number): void;
  deleteHead(): void;
  deleteTail(): void;
  toArray(): Array<T>;
}

export class LinkedList<T> implements TLinkedList<T> {
  private size: number;
  head: LinkedListNode<T> | null;

  constructor(initialData: Array<T> = []) {
    this.size = 0;
    this.head = null;

    for (const item of initialData) {
      this.append(item);
    }
  }

  *[Symbol.iterator]() {
    for (let current = this.head; current !== null; current = current.next) {
      yield current.value;
    }
  }
  prepend(value: T) {
    const node = new LinkedListNode(value);
    if (this.head === null) {
      this.head = node;
    } else {
      node.next = this.head;
      this.head = node;
    }
    this.size++;
  }

  append(value: T) {
    const node = new LinkedListNode(value);
    if (this.head === null) {
      this.head = node;
    } else {
      for (let current = this.head; current !== null; current = current.next) {
        if (current.next === null) {
          current.next = node;
          break;
        }
      }
    }
    this.size++;
  }

  addByIndex(value: T, index: number) {
    if (index < 0 || index > this.size + 1) {
      throw new Error("The index is not correct");
    } else if (this.head === null || index === 0) {
      this.prepend(value);
    } else {
      let previous = this.head;
      while (index - 1 > 0 && previous.next !== null) {
        previous = previous.next;
        index--;
      }
      previous.next = new LinkedListNode(value, previous.next);
    }
    this.size++;
  }

  deleteByIndex(index: number) {
    if (index < 0 || index > this.size) {
      throw new Error("The index is not correct");
    } else if (this.head === null || index === 0) {
      this.deleteHead();
    } else {
      let previous = this.head;
      while (
        index - 1 !== 0 &&
        previous.next !== null &&
        previous.next.next !== null
      ) {
        previous = previous.next;
      }
      previous.next = previous.next!.next;
    }
    this.size--;
  }

  deleteHead() {
    if (this.head === null) {
      throw new Error("No elements in the list");
    }
    this.head = this.head.next;
    this.size--;
  }

  deleteTail() {
    if (this.head === null) {
      throw new Error("No elements in the list");
    } else if (this.head.next === null) {
      this.head = null;
    } else {
      let current = this.head;
      while (current.next !== null && current.next.next !== null) {
        current = current.next;
      }
      current.next = null;
    }
    this.size--;
  }

  toArray() {
    return [...this];
  }
}
