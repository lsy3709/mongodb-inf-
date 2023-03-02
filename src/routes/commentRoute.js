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

//ch10 트랜잭션 작업
const { isValidObjectId, startSession } = require("mongoose");


// 조회 localhost:3000/blog/123/comment/456
/*
  /user
  /blog
  /blog/blog:blogId/comment

*/

commentRouter.post('/', async (req, res) => {
  //ch10 트랜잭션 작업
  const session = await startSession();
  // let session = await db.getMongo().startSession();
  let comment;

  try {
    //ch10 트랜잭션 작업
    await session.withTransaction(async () => {
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

        //ch10 트랜잭션 작업
        Blog.findById(blogId, {}, {}),
        User.findById(userId, {}, {}),
      ])
      // const blog = await Blog.findByIdAndUpdate(blogId);
      // const user = await User.findByIdAndUpdate(userId);

      if (!blog || !user)
        return res.status(400).send({ err: "blog or user does not exist" });

      if (!blog.islive) return res.status(400).send({ err: "blog is not available" })

      //ch7 작업중 
      // const comment = new Comment({ content, user, blog });
      comment = new Comment({
        content,
        user,
        userFullName: `${user.name.first} ${user.name.last}`,

        //ch9 무한 루프 해결책.
        blog: blogId,
      });


      //ch10 작업중
      //await session.abortTransaction()

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
      // await comment.save();

      //ch9. 최신 코멘트 3개 내장 부분 작업
      // blog.commentsCount++;
      // blog.comments.push(comment);
      // if (blog.commentsCount > 3) blog.comments.shift();


      //ch9, 내장된 코멘트 부분 갯수 추가하기. 
      // await Promise.all([

      //ch10 트랜잭션 작업
      // comment.save({}),

      //ch10 이미 세션이 내장 되어 있음. 
      // blog.save()
      //ch9. 최신 코멘트 3개 내장 부분 작업
      // Blog.updateOne({ _id: blogId }, { $inc: { commentsCount: 1 } }),
      // ]);

      //ch10 
      //});


      //ch10 2 다른 방법
      // $slice -3 제일 최근에 푸쉬된 3개만 남기고 다 삭제.
      // $slice 3 오래된 3개만 남기고 다 삭제.
      await Promise.all([comment.save(),
      Blog.updateOne(
        { _id: blogId },
        {
          $inc: { commentsCount: 1 },
          $push: {
            comments: { $each: [comment], $slice: -3 }
          }
        })])

      //ch10 트랜잭션 작업
      return res.send({ comment });
    })
  } catch (err) {
    return res.status(400).send({ err: err.message });
  } finally {
    //ch10 트랜잭션 작업
    // await session.endSession()
  }

});

// comment 불러오기
commentRouter.get('/', async (req, res) => {
  //ch9 페이징
  // 디폴트 페이지 처리. 
  let { page = 0 } = req.query;
  page = parseInt(page);
  const { blogId } = req.params;
  if (!isValidObjectId(blogId))
    return res.status(400).send({ err: "blogId is invalid" });

  // const comments = await Comment.find({ blog: blogId });
  // 측정 테스트 5개만 
  // const comments = await Comment.find({ blog: blogId }).limit(50);

  //ch9 페이징
  //후기 생성순서 기준으로 최신 정렬, 내림차순
  //한 페이지에 3개 

  // ch9 디폴트 page 값 확인 하기. 
  // console.log({ page });

  const comments = await Comment.find({ blog: blogId }).sort({ createdAt: -1 }).skip(page * 3).limit(3);

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