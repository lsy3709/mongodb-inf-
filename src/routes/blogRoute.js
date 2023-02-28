const { Router } = require("express");
const blogRouter = Router();

//리팩토링
// ch9 Comment 추가
const { Blog, User, Comment } = require("../models");
// const { Blog } = require("../models/Blog");
// const { User } = require("../models/User")
const { isValidObjectId } = require('mongoose')
//(6) 코멘트 부분 
const { commentRouter } = require("./commentRoute");

// (6) 코멘트 부분 
blogRouter.use("/:blogId/comment", commentRouter);

// 조회 
// localhost:3000/blog/123/comment/456

// 블로그 등록
blogRouter.post("/", async (req, res) => {
  try {
    const { title, content, islive, userId } = req.body;
    if (typeof title !== "string")
      return res.status(400).send({ err: "title is required" });
    if (typeof content !== "string")
      return res.status(400).send({ err: "content is required" });
    if (islive && typeof islive !== "boolean")
      return res.status(400).send({
        err: "islive must be a boolean"
      });
    if (!isValidObjectId(userId)) return res.status(400).send({ err: "userId is invalid" })

    let user = await User.findById(userId);
    if (!user) return res.status(400).send({ err: "user does not exist" });

    let blog = new Blog({ ...req.body, user });
    await blog.save();
    return res.send({ blog });

  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

//블로그 전체 조회
blogRouter.get("/", async (req, res) => {
  try {
    //전체 조회
    // const blogs = await Blog.find({})
    // 일부 10개만 조회.
    // const blogs = await Blog.find({}).limit(10);

    // 작업 중 
    // 앞에 비효율적인 방법으로 너무 많은 호출이 있지만, 
    // 지금은 3번 만 호출이 됨. 

    //ch8 GET /blog API에 Pagination 적용
    let { page } = req.query;
    page = parseInt(page);
    console.log({ page });
    let blogs = await Blog.find({}).sort({ updatedAt: -1 }).skip(page * 3).limit(3);
    // .populate([
    //   { path: "user" },
    //   { path: "comments", populate: { path: "user" } },
    // ]);

    return res.send({ blogs })
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

// 블로그 하나 불러오기.
blogRouter.get("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId)) res.status(400).send({ err: "blogId is invalid" })

    const blog = await Blog.findOne({ _id: blogId });

    //ch9 코멘트 갯수 구하기. 
    // const commentCount = await Comment.find({ blog: blogId }).countDocuments();

    //ch9 코멘트 갯수 구하기. 
    return res.send({ blog, commentCount })
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

// 업데이트 하기. 
blogRouter.put("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId)) res.status(400).send({ err: "blogId is invalid" })

    const { title, content } = req.body;
    if (typeof title !== "string")
      res.status(400).send({ err: "title is required" });
    if (typeof content !== "string")
      res.status(400).send({ err: "content is required" });

    const blog = await Blog.findByIdAndUpdate(
      { _id: blogId }, { title, content }, { new: true }
    );
    return res.send({ blog })

  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

// patch 부분 수정 할 때 사용. 
blogRouter.patch("/:blogId/live", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId)) res.status(400).send({ err: "blogId is invalid" })

    const { islive } = req.body;
    if (typeof islive !== "boolean") res.status(400).send({ err: "boolean islive is required" });

    const blog = await Blog.findByIdAndUpdate(
      blogId, { islive }, { new: true }
    );
    return res.send({ blog });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

module.exports = {
  blogRouter
};