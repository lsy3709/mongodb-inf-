const { Router } = require("express");

// commentRouter.post('/:commentId', async (req, res) => {
// 조회시 블로그 아이디가 조회가 안되는 부분 
//  Router({ mergeParams: true }); 해결 .
const commentRouter = Router({ mergeParams: true });
const { Comment } = require("../models/Comment");

// 조회 localhost:3000/blog/123/comment/456
/*
  /user
  /blog
  /blog/blog:blogId/comment

*/

commentRouter.post('/:commentId', async (req, res) => {
  return res.send(req.params);
});

commentRouter.get('/')

module.exports = {
  commentRouter
};