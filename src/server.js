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
// const { blogRouter } = require('./routes/blogRoute')

//(5)comment Route 추가. 
// const { commentRouter } = require('./routes/commentRoute')

//(6)리팩토링 하나로 합치기. 
const { blogRouter, commentRouter } = require('./routes')

//URI 부분 
// atlas 또는 도커 부분으로 해도 가능.
//mongodb+srv://admin3709:<password>@mongodbtutorial.c24ikv6.mongodb.net/test
//<password> 지우고 패스워드 입력.

// 도커로 테스트시 트랜잭션에서 에러가 발생. 단일 인스턴스 설정으로 안됨.
// 일단, 아틀라스로 다시 테스트 해보기.
//ex2
// const MONGO_URI = 'mongodb://localhost:27017/BlogService2';

// const MONGO_URI = 'mongodb+srv://admin3709:<패스워드>@mongodbtutorial.c24ikv6.mongodb.net/BlogService2';



const { generateFakeData } = require("../faker2")

const server = async () => {
  try {
    const { MONGO_URI } = process.env;
    if (!MONGO_URI) throw new Error("MONGO_URI is required!!!");

    // unique 추가시, 인덱스 추가. -> useCreateIndex: true , useFindAndModify:false, 6버전 부터는 안써도 됨. 
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,

    });

    //디버그 하기위한 명령어 쿼리를 콘솔 상에서 확인 가능. 
    // mongoose.set('debug', true)
    console.log('MongoDB connected')
    app.use(express.json())

    //미들웨어 추가 , (3)Route 추가 부분
    app.use('/user', userRouter)
    app.use('/blog', blogRouter)
    app.use('/blog/:blogId/comment', commentRouter)

    app.listen(3000, async () => {
      console.log('server listening on port 3000');
      //가짜 디비 추가 부분 
      // 생성 후 주석 처리하기. 
      // 한번에 만드면 부하 걸려서 나눠서 만들기. 

      // for (let i = 0; i < 20; i++) {
      //   await generateFakeData(10, 1, 10);
      // }

      // 유저 10명, 게시글 2개, 댓글 10개. 
      // 게시글 총 20개, 총 댓글 : 100개 
      // generateFakeData = async (userCount, blogsPerUser, commentsPerUser) => {
      // await generateFakeData(10, 2, 10);

      //ch8 추가 성능 테스트
      // console.time("insert time: ")
      // await generateFakeData(10000, 5, 20);
      // console.timeEnd("insert time: ")
    });

  } catch (err) {
    console.log(err)
  }

}
server();