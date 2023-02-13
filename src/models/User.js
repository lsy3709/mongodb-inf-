//몽구스로 유저 데이터를 만들 예정.

// 모델과 스키마 2개 만들 예정.

// 몽구스에게 알려줘야 함. 

// server.js 에서 사용할 예정. 

// 디스쳑링 적용전
// const mongoose = require('mongoose');

// 디스쳑링 적용후
const { Schema, model} = require('mongoose');

// 스키마 (데이터베이스 와 비슷)
const UserSchema = new Schema({
  username : {type : String, requireed: true},
  name: {
    first: {type : String, required: true},
    last: {type: String, required:true}
  },
  age: Number,
  email: String
}, {timestamps: true})

// User 로 해당 모델 user <-> UserSchema 연결
const User = model('user', UserSchema);

// 외부에서 가져다 쓰기.
module.exports = { User }

