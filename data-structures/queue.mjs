export default class Queue {
  constructor() {
    this._queue = [];
  }

  getLength() {
    return this._queue.length;
  }

  enqueue(...elements) {
    this._queue.push(...elements);
  }

  dequeue() {
    return this._queue.shift();
  }

  toString() {
    let string = '';

    for (let i = 0; i < this._queue.length; i++) {
      string += `${this._queue[i]} <-- `;
    }

    return string;
  }
}
