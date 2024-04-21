import Bucket from './hash-set-bucket.mjs';

function createBlankBuckets(capacity) {
  return Array.from({ length: capacity }, (cur) => {
    return (cur = new Bucket());
  });
}

export default class HashSet {
  constructor(capacity = 16) {
    this._capacity = capacity;
    this._targetLoadFactor = 0.8;
    this._buckets = createBlankBuckets(this._capacity);
  }

  _getHashCode(key) {
    let hashCode = 0;

    const primeNumber = 31;

    for (let i = 0; i < key.length; i++) {
      hashCode = primeNumber * hashCode + key.charCodeAt(i);
    }

    return hashCode;
  }

  _getIndex(hashCode) {
    return hashCode % this._capacity;
  }

  _getInputInfo(key) {
    const hashCode = this._getHashCode(key);
    const index = this._getIndex(hashCode);

    return { hashCode, index };
  }

  _getCurrentLoadFactor() {
    return this.length() / this._capacity;
  }

  _recalculateIndexes(entries) {
    for (let i = 0; i < entries.length; i++) {
      this.set(...entries[i]);
    }
  }

  _doubleArrayCapacity() {
    const entries = this.entries();
    this.clear();

    this._capacity *= 2;
    this._buckets = createBlankBuckets(this._capacity);

    this._recalculateIndexes(entries);
  }

  set(key) {
    const { index, hashCode } = this._getInputInfo(key);

    this._buckets[index].add(key, hashCode);

    if (this._getCurrentLoadFactor() >= this._targetLoadFactor) {
      this._doubleArrayCapacity();
    }
  }

  get(key) {
    const { index } = this._getInputInfo(key);

    return this._buckets[index].find(key);
  }

  has(key) {
    const { index } = this._getInputInfo(key);

    return this._buckets[index].contains(key);
  }

  remove(key) {
    const { index } = this._getInputInfo(key);

    if (!this.has(key)) return false;

    this._buckets[index].remove(key);
    return true;
  }

  length() {
    return this._buckets.reduce((acc, cur) => (acc += cur.getSize()), 0);
  }

  keys() {
    const bucketKeys = this._buckets.reduce((acc, cur) => {
      acc.push(cur.getKeys());
      return acc;
    }, []);

    return bucketKeys.flat();
  }

  clear() {
    this._buckets = createBlankBuckets(this._capacity);
  }
}
