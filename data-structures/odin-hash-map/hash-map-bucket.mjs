class Node {
  constructor(key, value, hash, next = null) {
    this._key = key;
    this._value = value;
    this._hash = hash;
    this._next = next;
  }

  get key() {
    return this._key;
  }

  set key(key) {
    this._key = key;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }

  get hash() {
    return this._hash;
  }

  set hash(hash) {
    this._hash = hash;
  }

  get next() {
    return this._next;
  }

  set next(next) {
    this._next = next;
  }
}

export default class LinkedList {
  constructor() {
    this._head = null;
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

  getSize() {
    let size = 0;
    let currentNode = this._head;

    while (currentNode) {
      size++;
      currentNode = currentNode.next;
    }

    return size;
  }

  getKeys() {
    const keys = [];

    let currentNode = this._head;

    while (currentNode) {
      keys.push(currentNode.key);
      currentNode = currentNode.next;
    }

    return keys;
  }

  getValues() {
    const values = [];

    let currentNode = this._head;

    while (currentNode) {
      values.push(currentNode.value);
      currentNode = currentNode.next;
    }

    return values;
  }

  getEntries() {
    const entries = [];

    let currentNode = this._head;

    while (currentNode) {
      entries.push([currentNode.key, currentNode.value]);
      currentNode = currentNode.next;
    }

    return entries;
  }

  contains(key) {
    let currentNode = this._head;

    while (currentNode) {
      if (currentNode.key === key) return true;

      currentNode = currentNode.next;
    }

    return false;
  }

  find(key) {
    let currentNode = this._head;

    while (currentNode) {
      if (currentNode.key === key) return currentNode;

      currentNode = currentNode.next;
    }

    return null;
  }

  findIndex(key) {
    let currentNode = this._head;
    let index = 0;

    while (currentNode) {
      if (currentNode.key === key) return index;

      currentNode = currentNode.next;
      index++;
    }

    return null;
  }

  prepend(key, value, hash) {
    const newHead = new Node(key, value, hash);
    newHead.next = this._head;
    this._head = newHead;
    this._tail = this._head;
  }

  replace(key, value) {
    const currentNode = this.find(key);
    currentNode.value = value;
  }

  append(key, value, hash) {
    this._tail.next = new Node(key, value, hash);
    this._tail = this._tail.next;
  }

  add(key, value, hash) {
    if (!this._head) {
      this.prepend(key, value, hash);
      return;
    }

    if (this.contains(key)) {
      this.replace(key, value);
    } else {
      this.append(key, value, hash);
    }
  }

  // we get the nodes as the copies of the list items
  // so we need to reassign their props to mutate them
  pop() {
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
    if (this._tail === this._head) this._tail = null;

    this._head = this._head.next;
  }

  at(index) {
    let currentNode = this._head;

    // the current node is set to the head
    // so i = 0 at this point
    for (let i = 1; i <= index; i++) {
      currentNode = currentNode.next;
    }

    return currentNode;
  }

  removeAt(index) {
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

  remove(key) {
    const index = this.findIndex(key);
    this.removeAt(index);
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
