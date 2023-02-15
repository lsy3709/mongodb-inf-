const express = require('express');
const app = express();
const mongoose = require('mongoose');
// 몽구스로 래핑해서 마치 컬렉션 처럼 사용하고, 기능이 조금 더 들어가 있음.
// 몽구스 기능. 
// 라우터 기능 추가로 주석.
//const { User } = require('./models/User')
//(3)Route 추가 부분, user 분리된 파일 라우팅 연결 하기.
const { userRouter } = require('./routes/userRoute')

//(4)blog Route 추가. 
const { blogRouter } = require('./routes/blogRoute')


//URI 부분 
// atlas 또는 도커 부분으로 해도 가능.
//mongodb+srv://admin3709:<password>@mongodbtutorial.c24ikv6.mongodb.net/test
//<password> 지우고 패스워드 입력.
const MONGO_URI = 'mongodb://localhost:27017/BlogService2';



const server = async () => {
  try {
    // unique 추가시, 인덱스 추가. -> useCreateIndex: true , useFindAndModify:false, 6버전 부터는 안써도 됨. 
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    //디버그 하기위한 명령어 쿼리를 콘솔 상에서 확인 가능. 
    mongoose.set('debug', true)
    console.log('MongoDB connected')
    app.use(express.json())

    //미들웨어 추가 , (3)Route 추가 부분
    app.use('/user', userRouter)

    app.use('/blog', blogRouter)



    app.listen(3000, function () {
      console.log('server listening on port 3000');
    })
  } catch (err) {
    console.log(err)
  }

}
server();