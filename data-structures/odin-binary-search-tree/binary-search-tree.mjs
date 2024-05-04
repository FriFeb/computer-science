import mergeSort from '../../algorithms/odin-recursion/merge-sort.mjs';
import Queue from '../queue.mjs';

class Node {
  constructor(value) {
    this._value = value;
    this._left = null;
    this._right = null;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }

  get left() {
    return this._left;
  }

  set left(left) {
    this._left = left;
  }

  get right() {
    return this._right;
  }

  set right(right) {
    this._right = right;
  }
}

function removeDuplicates(array) {
  return array.reduce((acc, cur) => {
    if (!acc.includes(cur)) acc.push(cur);
    return acc;
  }, []);
}

function createBalancedBinarySearchTree(array) {
  if (array.length === 0) return null;
  if (array.length === 1) return new Node(array[0]);

  const middleElementIndex = Math.floor(array.length / 2);
  const middleElement = array[middleElementIndex];

  const rootNode = new Node(middleElement);

  const leftSubarray = array.slice(0, middleElementIndex);
  const rightSubarray = array.slice(middleElementIndex + 1);

  const leftSubtree = createBalancedBinarySearchTree(leftSubarray);
  const rightSubtree = createBalancedBinarySearchTree(rightSubarray);

  rootNode.left = leftSubtree;
  rootNode.right = rightSubtree;

  return rootNode;
}

class BinarySearchTree {
  constructor(array) {
    array = removeDuplicates(array);
    array = mergeSort(array);

    this._root = createBalancedBinarySearchTree(array);
  }

  get root() {
    return this._root;
  }

  set root(root) {
    this._root = root;
  }

  height(node) {
    let leftSubtreeDepth = 0;
    let rightSubtreeDepth = 0;

    if (node.left) {
      leftSubtreeDepth++;
      leftSubtreeDepth += this.height(node.left);
    }
    if (node.right) {
      rightSubtreeDepth++;
      rightSubtreeDepth += this.height(node.right);
    }

    return leftSubtreeDepth >= rightSubtreeDepth
      ? leftSubtreeDepth
      : rightSubtreeDepth;
  }

  depth(node) {
    let initialNode = this._root;
    let depth = 0;

    while (initialNode != node) {
      if (node.value < initialNode.value) {
        initialNode = initialNode.left;
      }
      if (node.value > initialNode.value) {
        initialNode = initialNode.right;
      }

      depth++;
    }

    return depth;
  }

  insert(...values) {
    values.forEach((value) => {
      if (!this._root) this._root = new Node(value);

      let currentNode = this._root;
      let previousNode = null;

      while (currentNode) {
        previousNode = currentNode;

        if (value < currentNode.value) {
          currentNode = currentNode.left;
        } else {
          currentNode = currentNode.right;
        }
      }

      if (value < previousNode.value) {
        previousNode.left = new Node(value);
      } else {
        previousNode.right = new Node(value);
      }
    });
  }

  _deleteNodeWithChild(node) {
    if (node.left) {
      node.value = node.left.value;
      node.left = null;
    } else {
      node.value = node.right.value;
      node.right = null;
    }

    return node;
  }

  _getChildren(node) {
    return node.left || node.right;
  }

  _getNodeToBecomeRootInfo(node, isLeftSubtree) {
    node = isLeftSubtree ? node.left : node.right;
    let nodeFather = node;
    let nodeDepth = 0;

    while (isLeftSubtree ? node.right : node.left) {
      nodeFather = node;
      node = isLeftSubtree ? node.right : node.left;
      nodeDepth++;
    }

    const nodeChildren = this._getChildren(node);

    return {
      nodeDepth,
      node,
      nodeFather,
      nodeChildren,
    };
  }

  _deleteNodeWithChildren(node) {
    const {
      nodeDepth: leftSubtreeHighestNodeDepth,
      node: leftSubtreeHighestNode,
      nodeFather: leftSubtreeHighestNodeFather,
      nodeChildren: leftSubtreeChildren,
    } = this._getNodeToBecomeRootInfo(node, true);

    const {
      nodeDepth: rightSubtreeLowestNodeDepth,
      node: rightSubtreeLowestNode,
      nodeFather: rightSubtreeLowestNodeFather,
      nodeChildren: rightSubtreeChildren,
    } = this._getNodeToBecomeRootInfo(node, false);

    const isLeftNodeBetter =
      leftSubtreeHighestNodeDepth >= rightSubtreeLowestNodeDepth;

    const properNode = isLeftNodeBetter
      ? leftSubtreeHighestNode
      : rightSubtreeLowestNode;

    const properNodeDepth = isLeftNodeBetter
      ? leftSubtreeHighestNodeDepth
      : rightSubtreeLowestNodeDepth;

    const properNodeDirection = () => {
      if (isLeftNodeBetter) {
        if (properNodeDepth === 0) {
          return 'left';
        } else {
          return 'right';
        }
      } else {
        if (properNodeDepth === 0) {
          return 'right';
        } else {
          return 'left';
        }
      }
    };

    const properNodeFather = isLeftNodeBetter
      ? leftSubtreeHighestNodeFather
      : rightSubtreeLowestNodeFather;

    const properNodeChildren = isLeftNodeBetter
      ? leftSubtreeChildren
      : rightSubtreeChildren;

    node.value = properNode.value;

    properNodeFather[properNodeDirection()] = properNodeChildren;

    return node;
  }

  delete(value, node = this._root) {
    if (!node) return null;

    if (value < node.value) {
      node.left = this.delete(value, node.left);
    }
    if (value > node.value) {
      node.right = this.delete(value, node.right);
    }

    if (value === node.value) {
      switch (this.height(node)) {
        case 0:
          node = null;
          break;

        case 1:
          node = this._deleteNodeWithChild(node);
          break;

        default:
          node = this._deleteNodeWithChildren(node);
          break;
      }
    }

    return node;
  }

  find(value, node = this._root) {
    if (!node) return null;

    if (node.value === value) {
      return node;
    }

    if (value < node.value) {
      return this.find(value, node._left);
    }
    if (value > node.value) {
      return this.find(value, node._right);
    }
  }

  levelOrder(callback) {
    let node = this._root;
    const queue = new Queue();

    const result = [];

    while (node) {
      result.push(node.value);

      if (callback) callback(node);

      if (node.left) queue.enqueue(node.left);
      if (node.right) queue.enqueue(node.right);

      node = queue.dequeue();
    }

    return result;
  }

  preOrder(callback, node = this._root) {
    if (!node) return [];

    const root = node.value;
    if (callback) callback(node);

    const leftNode = this.preOrder(callback, node.left);
    const rightNode = this.preOrder(callback, node.right);

    return [root, ...leftNode, ...rightNode];
  }

  inOrder(callback, node = this._root) {
    if (!node) return [];

    const leftNode = this.inOrder(callback, node.left);

    const root = node.value;
    if (callback) callback(node);

    const rightNode = this.inOrder(callback, node.right);

    return [...leftNode, root, ...rightNode];
  }

  postOrder(callback, node = this._root) {
    if (!node) return [];

    const leftNode = this.postOrder(callback, node.left);
    const rightNode = this.postOrder(callback, node.right);

    const root = node.value;
    if (callback) callback(node);

    return [...leftNode, ...rightNode, root];
  }

  isBalanced(node = this._root) {
    if (!node) return true;

    let leftSubtreeHeight = 0,
      rightSubtreeHeight = 0;

    // Check the balance state of the current node
    if (node.left) leftSubtreeHeight = 1 + this.height(node.left);
    if (node.right) rightSubtreeHeight = 1 + this.height(node.right);
    if (Math.abs(leftSubtreeHeight - rightSubtreeHeight) > 1) return false;

    // Check the balance state of the current node children
    const isLeftSubtreeBalanced = this.isBalanced(node.left);
    const isRightSubtreeBalanced = this.isBalanced(node.right);
    if (!isLeftSubtreeBalanced || !isRightSubtreeBalanced) return false;

    return true;
  }

  balance() {
    const sortedValues = this.inOrder();

    this._root = createBalancedBinarySearchTree(sortedValues);
  }

  printTree(node = this._root, prefix = '', isLeft = true) {
    if (!node) return;

    if (node.right) {
      this.printTree(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    }

    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.value}`);

    if (node.left) {
      this.printTree(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
  }
}

function getRandomArray(elementsCount, min, max) {
  const result = [];

  for (let i = 0; i < elementsCount; i++) {
    const elem = Math.floor(Math.random() * (max - min) + min);
    result.push(elem);
  }

  return result;
}

function printTreeValues() {
  const levelOrder = balancedBinarySearchTree.levelOrder();
  const preOrder = balancedBinarySearchTree.preOrder();
  const inOrder = balancedBinarySearchTree.inOrder();
  const postOrder = balancedBinarySearchTree.postOrder();

  console.log(`levelOrder: ${levelOrder}`);
  console.log(`preOrder: ${preOrder}`);
  console.log(`inOrder: ${inOrder}`);
  console.log(`postOrder: ${postOrder}`);
}

function printTreeBalance() {
  const isBalanced = balancedBinarySearchTree.isBalanced();
  console.log(`The tree is ${isBalanced ? 'balanced' : 'unbalanced'}`);
}

const balancedBinarySearchTree = new BinarySearchTree(
  getRandomArray(20, 10, 100)
);
balancedBinarySearchTree.printTree();
printTreeBalance();
printTreeValues();

balancedBinarySearchTree.insert(...getRandomArray(5, 100, 200));
balancedBinarySearchTree.printTree();
printTreeBalance();

balancedBinarySearchTree.balance();
balancedBinarySearchTree.printTree();
printTreeBalance();
printTreeValues();
