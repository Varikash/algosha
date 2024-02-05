interface IStack<T> {
  push: (item: T) => void;
  pop: () => void;
  peak: () => T | null;
  getSize: () => number;
  getItems: () => T[];
  clear: () => void;
}

export class Stack<T> implements IStack<T> {
  private container: T[] = [];
  push = (item: T): void => {this.container.push(item);};
  pop = (): void => {this.container.pop();};
  peak = () => this.container[this.container.length -1];
  clear = () => this.container = [];
  getSize = () => this.container.length;
  getItems = (): T[] => this.container;
}