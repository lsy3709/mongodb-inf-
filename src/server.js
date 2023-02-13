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
    // unique 추가시, 인덱스 추가. -> useCreateIndex: true , 6버전 부터는 안써도 됨. 
    await mongoose.connect(MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology : true });
    console.log('MongoDB connected')
  
    app.use(express.json())
  
     // 예제1
    app.get('/user', async (req, res) => {
      try {
        // 전체 조회.
        const users = await User.find({});
        // 하나 조회
        // const users = await User.findOne({});
        return res.send({ users: users })
      } catch(err){
        console.log(err);
        return res.status(500).send({err : err.message})
      }
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
  
    // 예제3 특정 아이디로 조회하는 api 
    // 특정 아이디 변수로 매개변수를 받을 때 -> :userId
    app.get('/user/:userId', async(req,res)=> {
      // console.log(req.params)
      try {
        const { userId } = req.params;
        // 몽구스 기능에서 해당 아이디 형식에 맞는 유효성 체크 부분 추가.
        // 포스트 맨 검색시 아이디 부분에, 형식에 맞는 아이디로 조회 하기. 
        // 예제 localhost:3000/user/63eac2794330a3d7a2704504
        if(!mongoose.isValidObjectId(userId)) return res.status(400).send({err: "invalid userId"})
          const user = await User.findOne({_id: userId});
          return res.send({user});
      }catch(err){
        console.log(err);
        return res.status(500).send({err : err.message})
      }
    })

    //예제4 특정 유저 삭제하기. 
    app.delete('/user/:userId', async (req,res)=> {
      try {
        const { userId } = req.params;
        if(!mongoose.isValidObjectId(userId)) return res.status(400).send({err: "invalid userId"})
        const user = await User.findOneAndDelete({_id: userId});
        //const user = await User.DeleteOne({_id: userId});  , 삭제 만 하거나, 조회 하고 삭제등 
        return res.send({user})
      }catch(err){
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