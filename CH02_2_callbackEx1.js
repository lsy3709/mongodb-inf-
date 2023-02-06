
// promise , async, await 사용하기전 callback 함수 예 살펴보기.
//2
const addSum = (a, b,callback) => {
  setTimeout(() => {
    if(typeof a !== 'number' || typeof b !== 'number') return callback('a, b must be numbers');
    callback(undefined, a+b)
  }, 3000);
}
//3
let callback = (error,sum) => {
  if(error) return console.log({error});
  console.log({ sum })
}

//1
addSum(10,20,callback)
// 안되는 예
// addSum(10,'aa',callback)