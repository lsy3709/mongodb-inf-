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
      Blog.findByIdAndUpdate(blogId),
      User.findByIdAndUpdate(userId)
    ])
    // const blog = await Blog.findByIdAndUpdate(blogId);
    // const user = await User.findByIdAndUpdate(userId);

    if (!blog || !user)
      return res.status(400).send({ err: "blog or user does not exist" });

    if (!blog.islive) return res.status(400).send({ err: "blog is not available" })

    const comment = new Comment({ content, user, blog });
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

module.exports = {
  commentRouter
};