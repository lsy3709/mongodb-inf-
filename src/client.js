console.log("client code running.");
const axios = require('axios');

const URI = "http://localhost:3000";


// 비효율적인 예제

// populate 사용으로 성능이 많이 개선. 

//예제1
// const test = async () => {
//   // axios 로 node 서버에서 10개만 임의로 받아오기
//   const response = await axios.get("http://localhost:3000/blog")
//   // 콘솔에 출력해보기. 
//   console.log(response);
// }

//예제2
const test = async () => {

  //성능측정 
  console.time("loading time: ");

  // axios 로 node 서버에서 10개만 임의로 받아오기
  let {
    data: { blogs },
  } = await axios.get(`${URI}/blog`);
  // console.dir(blogs, { depth: 10 });

  // 콘솔에 출력해보기. 

  //예제3 전체 출력
  // console.log(blogs);

  // 예제4 길이와, 첫번째 요소만 출력. 
  // console.log(blogs.length, blogs[0]);

  // 비동기식으로 병렬로 불러오기 하려면, Promise.all 사용하기. 


  // 백엔드 작업 하기 위해서 주석 처리. 
  // blogs = await Promise.all(
  //   blogs.map(async (blog) => {
  //     const [res1, res2] = await Promise.all([
  //       axios.get(`${URI}/user/${blog.user}`),
  //       axios.get(`${URI}/blog/${blog._id}/comment`),
  //     ]);

  //     blog.user = res1.data.user;

  //     // 각 comment 객체에 유저 아이디 대신에 유저 객체가 대신 들어감. 
  //     blog.comments = await Promise.all(res2.data.comments.map(async comment => {
  //       const { data: { user } } = await axios.get(`${URI}/user/${comment.user}`)
  //       comment.user = user
  //       return comment;
  //     }))
  //     return blog
  //   })
  // );
  // console.log(blogs[0])

  //해당 유저 객체 하위에 내용 다보기. 
  // console.dir(blogs[0], { depth: 10 });

  //성능 측정하기. 
  console.timeEnd("loading time: ")

};


// test();

const testGroup = async () => {
  await test();
  await test();
  await test();
  await test();
  await test();

};

testGroup();