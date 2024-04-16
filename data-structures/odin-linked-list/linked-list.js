class Node {
  constructor(value, next = null) {
    if (!Number.isFinite(value)) {
      throw new Error('the value of the node is missed :(');
    }

    this._value = value;
    this._next = next;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }

  get next() {
    return this._next;
  }

  set next(next) {
    this._next = next;
  }
}

class LinkedList {
  constructor(value) {
    this._head = new Node(value);
    this._tail = this._head;
  }

  _getPreFinalNode() {
    let preFinalNode = this._head;

    if (!preFinalNode.next) return;

    while (preFinalNode.next != this._tail) {
      preFinalNode = preFinalNode.next;
    }

    return preFinalNode;
  }

  getHead() {
    return this._head;
  }

  getTail() {
    return this._tail;
  }

  getSize() {
    let size = 0;
    let currentNode = this._head;

    while (currentNode) {
      size++;
      currentNode = currentNode.next;
    }

    return size;
  }

  append(value) {
    if (!this._head) {
      this.prepend(value);
    } else {
      this._tail.next = new Node(value);
      this._tail = this._tail.next;
    }
  }

  prepend(value) {
    const newHead = new Node(value);
    newHead.next = this._head;
    this._head = newHead;
    if (!this._tail) this._tail = this._head;
  }

  // we get the nodes as the copies of the list items
  // so we need to reassign their props to mutate them
  pop() {
    if (!this._head) return;

    let preFinalNode = this._getPreFinalNode();

    if (!preFinalNode) {
      this._head = null;
      this._tail = this._head;
    } else {
      preFinalNode.next = null;
      this._tail = preFinalNode;
    }
  }

  shift() {
    if (!this._head) return;

    this._head = this._head.next;
  }

  contains(value) {
    let currentNode = this._head;

    while (currentNode) {
      if (currentNode.value === value) return true;

      currentNode = currentNode.next;
    }

    return false;
  }

  find(value) {
    let currentNode = this._head;

    while (currentNode) {
      if (currentNode.value === value) return currentNode;

      currentNode = currentNode.next;
    }

    return null;
  }

  findIndex(value) {
    let currentNode = this._head;
    let index = 0;

    while (currentNode) {
      if (currentNode.value === value) return index;

      currentNode = currentNode.next;
      index++;
    }

    return null;
  }

  at(index) {
    if (index < 0) {
      index += this.getSize();
    }

    if (index < 0 || index > this.getSize()) return null;

    let currentNode = this._head;

    // the current node is set to the head
    // so i = 0 at this point
    for (let i = 1; i <= index; i++) {
      currentNode = currentNode.next;
    }

    return currentNode;
  }

  insertAt(value, index) {
    if (index < 0) {
      // to be able to insert in the end of the list
      index += this.getSize() + 1;
    }

    if (index < 0 || index > this.getSize()) return;

    if (index === 0) {
      this.prepend(value);
      return;
    }

    if (index === this.getSize()) {
      this.append(value);
      return;
    }

    const newNode = new Node(value);

    const oldNode = this.at(index);
    const previousNode = this.at(index - 1);

    previousNode.next = newNode;
    newNode.next = oldNode;
  }

  removeAt(index) {
    if (index < 0) {
      index += this.getSize();
    }

    if (index < 0 || index > this.getSize()) return;

    if (index === 0) {
      this.shift();
      return;
    }

    if (index === this.getSize() - 1) {
      this.pop();
      return;
    }

    const previousNode = this.at(index - 1);
    const nextNode = this.at(index + 1);

    previousNode.next = nextNode;
  }

  toString() {
    if (!this._head) return 'null';

    let currentNode = this._head;
    let string = `( ${currentNode.value} ) -->`;

    while (currentNode.next) {
      currentNode = currentNode.next;
      string += ` ( ${currentNode.value} ) -->`;
    }

    return string + ' null';
  }
}

const myFirstLinkedList = new LinkedList(1);

myFirstLinkedList.append(2);
myFirstLinkedList.append(3);
myFirstLinkedList.append(4);
myFirstLinkedList.append(5);
debugger;
