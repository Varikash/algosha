interface IQueue<T> {
  enqueue: (item: T) => void;
  dequeue: () => void;
  peak: () => T | null;
  clear: () => void;
  getItems: () => Array<T | null>;
  getHead: () => number;
  getTail: () => number;
}

export class Queue<T> implements IQueue<T> {
  private container: (T | null)[] = [];
  private head = 0;
  private tail = 0;
  private readonly size: number = 0;
  private length: number = 0;

  constructor(size: number) {
    this.size = size;
    this.container = Array(size);
  }

  enqueue = (item: T) => {
    if (this.length >= this.size) {
      throw new Error("Превышен максимальный размер очереди");
    }
    this.container[this.tail % this.size] = item;
    this.tail++;
    this.length++;
  };

  dequeue = () => {
    if (this.isEmpty()) {
      throw new Error("Очередь пуста");
    }
    delete this.container[this.head % this.size];
    this.head++;
    this.length--;
  };

  peak = (): T | null => {
    if (this.isEmpty()) {
      return null;
    }
    return this.container[this.head % this.size];
  };

  clear = () => {
    this.length = 0;
    this.tail = 0;
    this.head = 0;
  };

  isEmpty = () => this.length === 0;
  getHead = () => this.head;
  getTail = () => this.tail;
  getItems = () => this.container;
  getLength = () => this.length;

}