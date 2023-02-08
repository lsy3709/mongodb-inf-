const express = require('express');
const app = express();

const users = [{ name: "SangYong", age:40}]

const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017';

mongoose.connect(MONGO_URI).then(result => console.log({result}) )

//express 파싱 기능 미들웨어 함수 추가
app.use(express.json())

// url 매핑 소개 및 간단 예제1
// app.get('/', function(req,res){
//   return res.send('hello world!!!!')
// })
// 예제2
app.get('/user2', function(req,res){
  console.log(req);
})
// 예제3
app.get('/user3', function(req,res){
  return res.send({users: users})
})
// postman 연동 확인  예제4 
app.post('/user4', function(req,res){
  users.push({name:"SangYong", age:40})
  return res.send({sucess: true})
})

// postman 연동 확인- req 확인  예제5 
// javascript 객체 , 키 와
// json 의 차이점, 키 부분에서 json은 모두 문자열 형태.
// 그리고 postman 에서 실행시 오류 나는 부분 체크 
// 미들웨어 함수 사용 : json 으로 넘어온 값을 자바스크립트로 파싱하기.
// postman : post , body , JSON 타입 설정후 테스트 
app.post('/user5', function(req,res){
  console.log(req.body)
  users.push({name:req.body.name, age:req.body.age})
  return res.send({sucess: true})
})

// postman 연동 확인- req 확인  예제6
app.post('/user6', function(req,res){
  console.log(req.body)
  users.push({name:req.body.name, age:req.body.age})
  return res.send({sucess: true})
})

app.listen(3000,function(){
  console.log('server listening on port 3000');
})