console.log('start')

//람다 타입
setTimeout(() => {

}, 3000);
// 일반 함수 타입
//ex1 3초 뒤에 함수 실행 
setTimeout(function(){
  console.log('ready ....')
}, 3000);

console.log('end')