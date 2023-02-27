console.log("client code running.");
const axios = require('axios');

//예제1
// const test = async () => {
//   // axios 로 node 서버에서 10개만 임의로 받아오기
//   const response = await axios.get("http://localhost:3000/blog")
//   // 콘솔에 출력해보기. 
//   console.log(response);
// }

//예제2
const test = async () => {
  // axios 로 node 서버에서 10개만 임의로 받아오기
  let {
    data: { blogs },
  } = await axios.get("http://localhost:3000/blog");
  // 콘솔에 출력해보기. 

  //예제3 전체 출력
  // console.log(blogs);

  // 예제4 길이와, 첫번째 요소만 출력. 
  // console.log(blogs.length, blogs[0]);

  // 비동기식으로 병렬로 불러오기 하려면, Promise.all 사용하기. 

  blogs = await Promise.all(
    blogs.map(async (blog) => {
      const res1 = await axios.get(`http://localhost:3000/user/${blog.user}`);
      const res2 = await axios.get(`http://localhost:3000/blog/${blog._id}/comment`);

      blog.user = res1.data.user;
      blog.comments = res2.data.comments;
      return blog
    })
  );
  console.log(blogs[0])

};


test();