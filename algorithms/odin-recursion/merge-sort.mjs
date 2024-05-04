function mergeArrays(arr1, arr2) {
  const resultArray = [];

  if (!arr1.length) {
    resultArray.push(...arr2);
    return resultArray;
  }
  if (!arr2.length) {
    resultArray.push(...arr1);
    return resultArray;
  }

  const lowestArr1Element = arr1[0];
  const lowestArr2Element = arr2[0];

  if (lowestArr1Element < lowestArr2Element) {
    resultArray.push(lowestArr1Element);
    arr1.shift();
  } else {
    resultArray.push(lowestArr2Element);
    arr2.shift();
  }

  const biggerElements = mergeArrays(arr1, arr2);
  return resultArray.concat(biggerElements);
}

/**
 * Sort an array using merge sort algorithm
 * @param {array} array input array
 * @returns {array} sorted array
 */
export default function mergeSort(array) {
  // An array is already sorted if there is only 1 element
  if (array.length == 1) return array;

  const middleElement = Math.floor(array.length / 2);

  const leftArrPart = array.slice(0, middleElement);
  const rightArrPart = array.slice(middleElement);

  const sortedLeftArrPart = mergeSort(leftArrPart);
  const sortedRightArrPart = mergeSort(rightArrPart);

  return mergeArrays(sortedLeftArrPart, sortedRightArrPart);
}
