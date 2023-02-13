const express = require('express');
const app = express();
const  mongoose = require('mongoose');
// 몽구스로 래핑해서 마치 컬렉션 처럼 사용하고, 기능이 조금 더 들어가 있음.
// 몽구스 기능. 
const { User } = require('./models/User')

//URI 부분 
// atlas 또는 도커 부분으로 해도 가능.
//mongodb+srv://admin3709:<password>@mongodbtutorial.c24ikv6.mongodb.net/test
//<password> 지우고 패스워드 입력.
const MONGO_URI = 'mongodb://localhost:27017/BlogService2';

const server = async () => {
  try {
    await mongoose.connect(MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology : true});
    console.log('MongoDB connected')
  
    app.use(express.json())
  
     // 예제1
    app.get('/user', (req, res) => {
      // return res.send({ users: users })
    })
    // postman 연동 확인  예제2
    app.post('/user', async (req, res) => {
      try {
        let { username, name} = req.body;
        // 아래 코드와 동일 디스트럭쳐
        // let username = req.body.username;
        // let name = req.body.name;
        if(!username) return res.status(400).send({err: " username is required"});
        if(!name || !name.first || !name.last) return res.status(400).send({
          err: "Both first and last names are required"
        });
          const user = new User(req.body);
          await user.save();
          return res.send({ user })
      } catch(err) {
          console.log(err);
          return res.status(500).send({err : err.message})
      }
    })
  
     
    app.listen(3000, function () {
      console.log('server listening on port 3000');
    })
  } catch(err) {
    console.log(err)
  }
  
}
server();