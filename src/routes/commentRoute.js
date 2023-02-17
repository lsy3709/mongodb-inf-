const { Router } = require("express");

// commentRouter.post('/:commentId', async (req, res) => {
// 조회시 블로그 아이디가 조회가 안되는 부분 
//  Router({ mergeParams: true }); 해결 .
const commentRouter = Router({ mergeParams: true });
const { Comment } = require("../models/Comment");
const { Blog } = require("../models/Blog");
const { User } = require("../models/User");
const { isValidObjectId } = require("mongoose");


// 조회 localhost:3000/blog/123/comment/456
/*
  /user
  /blog
  /blog/blog:blogId/comment

*/

commentRouter.post('/:commentId', async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content, userId } = req.body;
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: "blogId is invalid" });
    if (!isValidObjectId(userId))
      return res.status(400).send({ err: "userId is invalid" });
    if (typeof content !== "string")
      return res.status(400).send({ err: "content is invalid" });

    const blog = await Blog.findByIdAndUpdate(blogId);
    const user = await User.findByIdAndUpdate(userId);

    if (!blog || !user)
      return res.status(400).send({ err: "blog or user does not exist" });

    if (!blog.islive) res.status(400).send({ err: "blog is not available" })

    const comment = new Comment({ content, user, blog });
    return res.send({ comment });
  } catch (err) {
    return res.status(400).send({ err: err.message });
  }

});

commentRouter.get('/')

module.exports = {
  commentRouter
};