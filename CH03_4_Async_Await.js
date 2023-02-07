const addSum = (a, b) => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (typeof a !== 'number' || typeof b !== 'number') {
      reject('a,b must be numbers');
    }
    resolve(a + b)
  }, 1000);
})


// ex1 해당 변수 sum 에 접근도 용이.
// async 시 중괄호 부분 확인하기. 
// const totalSum = async () => {
// let sum = await addSum(10,10)
// let sum2 = await addSum(sum,10)
// console.log({sum,sum2})
// }
// totalSum();

// ex2 catch
const totalSum = async () => {
  try {
    let sum = await addSum(10, 10)
    let sum2 = await addSum(sum, 10)
    console.log({ sum, sum2 })
  } catch (err) {
    if (err) console.log({ err })
  }
}
totalSum();

