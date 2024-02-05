import { ElementStates } from "../../types/element-states";

export class Node<T> {
  value: T;
  next: Node<T> | null;

  constructor(value: T, next?: Node<T> | null) {
    this.value = value;
    this.next = next === undefined ? null : next;
  }
}

interface ILinkedList<T> {
  prepend: (element: T) => void;
  append: (element: T) => void;
  insertByIndex: (element: T, position: number) => void;
  removeByIndex: (index: number) => void;
  shift: () => void;
  pop: () => void;
  isEmpty: () => boolean;
  print: () => void;
}

export class LinkedList<T> implements ILinkedList<T> {
  private head: Node<T> | null;
  private tail: Node<T> | null;
  private size: number;
  private initialArray(items: T[]) {
    items.forEach((item) => this.append(item));
  }

  constructor(items: T[]) {
    this.head = null;
    this.tail = null;
    this.size = 0;

    if (items?.length) {
      this.initialArray(items);
    }
  }

  isEmpty = () => this.size === 0;

  insertByIndex(element: T, index: number) {
    if (index < 0 || index > this.size) {
      console.log("Enter a valid index");
      return;
    } else {
      if (index === 0) {
        this.prepend(element);
      } else {
        if (this.head === null) {
          console.log("Cannot insert into an empty list");
          return;
        }

        const node = new Node(element);
        let curr: Node<T> | null = this.head;

        for (let i = 0; i < index - 1; i++) {
          if (curr && curr.next) {
            curr = curr.next;
          } else {
            break; // Выход из цикла, если достигнут конец списка
          }
        }
        if (curr) {
          node.next = curr.next;
          curr.next = node;
        }
      }
      this.size++;
    }
  }

  removeByIndex(index: number) {
    if (index < 0 || index > this.size) {
      console.log("Enter a valid index");
      return;
    }
    let currentNode = this.head;
    if (index === 0 && currentNode) {
      this.head = currentNode.next;
    } else {
      let prevNode = null;
      let currentIndex = 0;

      while (currentIndex < index && currentNode) {
        prevNode = currentNode;
        currentNode = currentNode.next;
        currentIndex++;
      }

      if (prevNode && currentNode) {
        prevNode.next = currentNode.next;
      }
    }
    this.size--;
  }

  shift() {
    if (!this.head) return null;
    let head = this.head;
    if (head.next) {
      this.head = head.next;
    } else {
      this.head = null;
    }
    this.size--;
    return head ? head.value : null;
  }

  pop() {
    if (!this.size) return null;

    let current = this.head;
    let prev = null;
    let currentIndex = 0;

    while (currentIndex < this.size - 1 && current) {
      prev = current;
      current = current.next;
      currentIndex++;
    }

    if (prev && current) {
      prev.next = current.next;
    }

    this.size--;

    return current ? current.value : null;
  }

  prepend(element: T): void {
    const node = new Node(element);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      this.head = node;
    }
    this.size++;
  }

  append(element: T) {
    const node = new Node(element);
    if (!this.head || !this.tail) {
      this.head = node;
      this.tail = node;
      this.size++;
      return this;
    }
    this.tail.next = node;
    this.tail = node;
    this.size++;
  }

  get getSize() {
    return this.size;
  }

  getArrayWithState() {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }

    return [...result].map((item) => ({
      item: item,
      state: ElementStates.Default,
    }));
  }

  print() {
    let curr = this.head;
    let res = "";
    while (curr) {
      res += `${curr.value} `;
      curr = curr.next;
    }
    console.log(res);
  }
}