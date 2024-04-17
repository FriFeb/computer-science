/**
 * Time complexity = O(1) + O(1) + O(1) + O(n/2) + O(1) = O(4) + O(n/2) = O(n/2) = O(n)
 * Space complexity = O(n) + O(1) + O(n) + O(1) + O(1) = O(3) + O(2n) = O(2n) = O(n)
 * @param {[]} array input array
 * @param {*} targetNumber number to search
 * @returns all the indexes of the targetNumber in the array
 */

// In the same manner we could use 3, 4, etc variables to store
// the certain amount of array numbers at the current iteration
// but it is inefficient anyway, because requires O(N) time and space

function search(array, targetNumber) {
  const indexes = [];

  let i = 0,
    j = array.length - 1;

  while (i < j) {
    if (array[i] === targetNumber) indexes.push(i);
    if (array[j] === targetNumber) indexes.push(j);

    i++;
    j--;
  }

  if (array[i] === targetNumber) indexes.push(i);

  return indexes;
}

const indexes = search([3, 3, 2, 4, 4, 5, 4, 6, 8], 4);
console.log(indexes);
