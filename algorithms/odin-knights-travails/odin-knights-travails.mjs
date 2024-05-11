import Queue from '../../data-structures/queue.mjs';

function isVertex(i, j) {
  return i < 0 || i > 7 || j < 0 || j > 7 ? false : true;
}

function getVertexNeighbours(i, j) {
  const neighbours = [];

  for (let iShift = i - 2; iShift <= i + 2; iShift++) {
    if (iShift === i) continue;

    const jShift = Math.abs(iShift - i) === 2 ? 1 : 2;

    const upperVertex = [iShift, j + jShift];
    const lowerVertex = [iShift, j - jShift];

    if (isVertex(...upperVertex)) neighbours.push(upperVertex);
    if (isVertex(...lowerVertex)) neighbours.push(lowerVertex);
  }

  return neighbours;
}

/**
 * Allows to get the neighbours of any vertex in a constant time O(1)
 * @returns {array} adjacency list
 */
function createAdjacencyList() {
  const adjacencyList = [];

  for (let i = 0; i < 8; i++) {
    adjacencyList[i] = [];
    for (let j = 0; j < 8; j++) {
      adjacencyList[i][j] = getVertexNeighbours(i, j);
    }
  }

  return adjacencyList;
}

/**
 * Checks whether the vertices are equal or not
 * @param {array} firstVertex
 * @param {array} secondVertex
 * @returns {boolean}
 */
function isEqual(firstVertex, secondVertex) {
  return (
    firstVertex &&
    secondVertex &&
    firstVertex[0] === secondVertex[0] &&
    firstVertex[1] === secondVertex[1]
  );
}

function isTraversed(vertex, traversedVertices) {
  return traversedVertices.some((traversedVertex) =>
    isEqual(vertex, traversedVertex)
  );
}

function removeCycles(vertices, traversedVertices) {
  return vertices.reduce((acc, cur) => {
    if (!isTraversed(cur, traversedVertices)) {
      acc.push(cur);
    }

    return acc;
  }, []);
}

function getVertexAcyclicNeighbours(vertex, traversedVertices) {
  const currentVertexNeighbours = adjacencyList[vertex[0]][vertex[1]];

  return removeCycles(currentVertexNeighbours, traversedVertices);
}

function enqueueVertexNeighbours(queue, neighbours, path, traversedVertices) {
  neighbours.forEach((neighbour) => {
    traversedVertices.push(neighbour);

    const neighbourPath = [...path, neighbour];
    queue.enqueue({ neighbour, neighbourPath });
  });
}

function isPathFound(neighbours, targetVertex) {
  return neighbours.some((neighbour) => isEqual(neighbour, targetVertex));
}

/**
 * It takes O(V + E) time in the worst case scenario,
 * where V is the number of the vertices of the graph
 * and E is the number of the edges of the graph
 * @param {*} currentVertex starting point
 * @param {*} endVertex end point
 * @param {*} shortestPath
 * @param {*} traversedVertices
 * @param {*} queue
 * @returns {array} The shortest path for the knight moves
 */
function getShortestPath(
  currentVertex,
  endVertex,
  shortestPath = [currentVertex],
  traversedVertices = [currentVertex],
  queue = new Queue()
) {
  // Takes O(D) time, where D is the number
  // of the neighbours of the currentVertex
  const currentVertexAcyclicNeighbours = getVertexAcyclicNeighbours(
    currentVertex,
    traversedVertices
  );

  // Takes O(D) time, where D is the number
  // of the neighbours of the currentVertex
  enqueueVertexNeighbours(
    queue,
    currentVertexAcyclicNeighbours,
    shortestPath,
    traversedVertices
  );

  // Takes O(D) time, where D is the number
  // of the neighbours of the currentVertex
  if (isPathFound(currentVertexAcyclicNeighbours, endVertex)) {
    // Takes O(1) time
    shortestPath.push(endVertex);
  } else {
    // Takes O(1) time
    const { neighbour, neighbourPath } = queue.dequeue();

    // Takes O(1) time
    shortestPath = getShortestPath(
      neighbour,
      endVertex,
      neighbourPath,
      traversedVertices,
      queue
    );
  }

  // Takes O(1) time
  return shortestPath;
}

function printPath(path) {
  let string = '';

  const lastMove = path[path.length - 1];

  path.forEach((move) => {
    if (isEqual(move, lastMove)) string += `[${move}]`;
    else string += `[${move}] --> `;
  });

  console.log(
    `You made it in ${path.length - 1} moves! Here's your path:\n${string}`
  );
}

function knightsMoves(startVertex, endVertex) {
  const shortestPath = getShortestPath(startVertex, endVertex);
  printPath(shortestPath);
}

const adjacencyList = createAdjacencyList();
knightsMoves([0, 0], [7, 7]);
