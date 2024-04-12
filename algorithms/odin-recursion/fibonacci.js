function fibs(n) {
  const arr = [0, 1];

  for (let i = 2; i < n; i++) {
    arr[i] = arr[i - 1] + arr[i - 2];
  }

  return arr;
}

function fibsRec(n) {
  if (n <= 2) {
    return [0, 1];
  }

  const arr = fibsRec(n - 1);
  arr.push(arr.at(-1) + arr.at(-2));

  return arr;
}

console.log(fibs(8));
console.log(fibsRec(8));
