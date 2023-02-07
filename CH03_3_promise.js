const addSum = (a,b) => new Promise((resolve, reject) => {
  setTimeout( () => {
    if(typeof a !== 'number' || typeof b !== 'number') {
      reject('a,b must be numbers');
    }
    resolve(a+b)
  },1000);
})
//ex1
// addSum(10,20)
//   .then(sum => console.log({sum}))
//   .catch(error => console.log({error}))

  // Promise : 대기중, 상태 보고
  // 성공 -> resolve
  // 실패 -> reject 
  // 2개 중에 하나만 실행되면 됨. 
  //
  // addSum 계속 호출시 Promise 버전으로 테스팅
  // callback 함수와 비교 중, Promise 버전으로 작업시 더 가독성 좋다. 복잡도가 낮다.
  // callback 지옥이 없다. 괄호안에 괄호안에 작업 이런식의 지옥.

//ex2
// addSum(10,20)
//   .then(sum1 => addSum(sum1,10))
//   .then(sum2 => console.log({sum2}))
//   .catch(error => console.log({error}))

  //ex3
  // addSum(10,20)
  // .then(sum1 => {
  //   console.log({ sum1 })
  //   return addSum(sum1,10)
  // })
  // .then(sum2 => console.log({sum2}))
  // .catch(error => console.log({error}))

  //ex4 , Promise Chain 
  //Promise 샘플 코드 형태는 가져와 사용하고, 
  // 아래 부분 then 부분만 커스텀해서 사용하면 됨. 
  //
  // addSum(10,20)
  // .then(sum1 => addSum(sum1,1))
  // .then(sum1 => addSum(sum1,1))
  // .then(sum1 => addSum(sum1,1))
  // .then(sum1 => addSum(sum1,1))
  // .then(sum => console.log({sum}))
  // .catch(error => console.log({error}))

// ex5