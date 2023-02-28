const { Router } = require("express");

// commentRouter.post('/:commentId', async (req, res) => {
// 조회시 블로그 아이디가 조회가 안되는 부분 
//  Router({ mergeParams: true }); 해결 .
const commentRouter = Router({ mergeParams: true });

//리팩토링
const { Blog, User, Comment } = require("../models");

// const { Comment } = require("../models/Comment");
// const { Blog } = require("../models/Blog");
// const { User } = require("../models/User");
const { isValidObjectId } = require("mongoose");


// 조회 localhost:3000/blog/123/comment/456
/*
  /user
  /blog
  /blog/blog:blogId/comment

*/

commentRouter.post('/', async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content, userId } = req.body;
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: "blogId is invalid" });
    if (!isValidObjectId(userId))
      return res.status(400).send({ err: "userId is invalid" });
    if (typeof content !== "string")
      return res.status(400).send({ err: "content is required" });

    //성능 개선  병렬로 한번에 불러오기.
    const [blog, user] = await Promise.all([

      //ch7 오타 수정.
      // Blog.findByIdAndUpdate(blogId),
      // User.findByIdAndUpdate(userId)
      Blog.findById(blogId),
      User.findById(userId)
    ])
    // const blog = await Blog.findByIdAndUpdate(blogId);
    // const user = await User.findByIdAndUpdate(userId);

    if (!blog || !user)
      return res.status(400).send({ err: "blog or user does not exist" });

    if (!blog.islive) return res.status(400).send({ err: "blog is not available" })

    //ch7 작업중 
    // const comment = new Comment({ content, user, blog });
    const comment = new Comment({
      content,
      user,
      userFullName: `${user.name.first} ${user.name.last}`,
      blog,
    });

    //ch7 작업중. 
    //       await comment.save();
    // await Blog.updateOne({ _id: blogId },{$push: { comments: comment}}),

    // 하나로 Promise 로 묶기
    // ch9 작업 중 , 잠시 주석. 
    // await Promise.all([
    //   comment.save(),
    //   Blog.updateOne({ _id: blogId }, { $push: { comments: comment } })
    // ]);

    // ch9 코멘트만 생성
    await comment.save();

    return res.send({ comment });
  } catch (err) {
    return res.status(400).send({ err: err.message });
  }

});

// comment 불러오기
commentRouter.get('/', async (req, res) => {
  const { blogId } = req.params;
  if (!isValidObjectId(blogId))
    return res.status(400).send({ err: "blogId is invalid" });



  // const comments = await Comment.find({ blog: blogId });

  // 측정 테스트 5개만 
  const comments = await Comment.find({ blog: blogId }).limit(50);

  return res.send({ comments });



});

// comment nesting 수정 가능하게끔 , ch7
commentRouter.patch("/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  if (typeof content !== "string")
    return res.status(400).send({ err: "content is required" });

  //병렬로 변경하기 ch7
  const [comment] = await Promise.all([
    Comment.findOneAndUpdate(
      { _id: commentId },
      { content },
      { new: true }
    ),
    //몽고 디비 문법 중요함.!!
    // 비정규화 특징. 
    // 복잡한 업데이트를 쉽게 한번에 처리 가능. 
    Blog.updateOne(
      { 'comments._id': commentId },
      { "comments.$.content": content }
    ),
  ]);
  return res.send({ comment });
});

// 삭제 하기. 
commentRouter.delete("/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findOneAndDelete({ _id: commentId });

  // ch7 pull , 2가지 요건 다 충족해서 가져올 때 
  // ex1
  //   await Blog.updateOne({ "comments._id": commentId },
  //     { $pull: { comments: { $elemMatch: { content: "hello", state: true } } } })
  //   return res.send({ comment });
  // })

  //ex2 
  await Blog.updateOne({ "comments._id": commentId },
    { $pull: { comments: { _id: commentId } } });
  return res.send({ comment });
})

module.exports = {
  commentRouter
};