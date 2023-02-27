//server.js 에서 파일 분리, user 관련 파일 분리
//(3)Route 추가 부분
const { Router } = require('express');
const userRouter = Router();
const mongoose = require("mongoose");

// 리팩토링
const { User, Blog, Comment } = require('../models');


// 예제1 postman 으로 예제 실습.
userRouter.get('/', async (req, res) => {
  try {
    // 전체 조회.
    const users = await User.find({});
    // 하나 조회
    // const users = await User.findOne({});
    return res.send({ users: users })
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message })
  }
})
// postman 연동 확인  예제2
userRouter.post('/', async (req, res) => {
  try {
    let { username, name } = req.body;
    // 아래 코드와 동일 디스트럭쳐
    // let username = req.body.username;
    // let name = req.body.name;
    if (!username) return res.status(400).send({ err: " username is required" });
    if (!name || !name.first || !name.last) return res.status(400).send({
      err: "Both first and last names are required"
    });
    const user = new User(req.body);
    await user.save();
    return res.send({ user })
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message })
  }
})

// 예제3 특정 아이디로 조회하는 api 
// 특정 아이디 변수로 매개변수를 받을 때 -> :userId
userRouter.get('/:userId', async (req, res) => {
  // console.log(req.params)
  try {
    const { userId } = req.params;
    // 몽구스 기능에서 해당 아이디 형식에 맞는 유효성 체크 부분 추가.
    // 포스트 맨 검색시 아이디 부분에, 형식에 맞는 아이디로 조회 하기. 
    // 예제 localhost:3000/user/63eac2794330a3d7a2704504
    if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: "invalid userId" })
    const user = await User.findOne({ _id: userId });
    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message })
  }
})

//예제4 특정 유저 삭제하기. 
// ch7 유저 삭제하기. 
userRouter.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: "invalid userId" })
    const [user] = await Promise.all([
      User.findOneAndDelete({ _id: userId }),
      //ch7 유저 삭제 작업중. 
      // 유저 삭제, 유저 작성한 글 삭제, 코멘트 삭제, 코멘트 삭제 글 불러오기.
      Blog.deleteMany({ "user._id": userId }),
      Blog.updateMany(
        { "comments.user": userId },
        { $pull: { comments: { user: userId } } }
      ),
      Comment.deleteMany({ user: userId }),
    ]);
    //const user = await User.DeleteOne({_id: userId});  , 삭제 만 하거나, 조회 하고 삭제등 


    return res.send({ user })
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message })
  }
})

//예제5 업데이트 put 
// 업데이트시 바로 적용이 안되어서 -> {new: true} 추가.
userRouter.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: "invalid userId" })

    // age, name 2개 업데이트 
    const { age, name } = req.body;
    if (!age && !name) return res.status(400).send({ err: "age or name is required" });

    // if(!age) return res.status(400).send({err: "age is required"});
    if (age && typeof age !== 'number') return res.status(400).send({ err: "age must be a number" });
    if (name && typeof name.first !== 'string' && typeof name.last !== 'string') return res.status(400).send({ err: "first and last name are string" });

    // 아래 코드가 없어도 -> 업데이트 시, name, age 중 하나만 있어도 업데이트 null 업이도 잘됨.
    //  let updateBody ={};
    //  if(age) updateBody.age = age;
    //  if(name) updateBody.name = name;
    //  const user = await User.findByIdAndUpdate(userId,updateBody,{new: true});

    //대체 { $set: {age}} -> { age}
    // 한번에 처리할 때, 이게 약간 빠름. 
    //const user = await User.findByIdAndUpdate(userId, { age, name }, { new: true });
    // const user = await User.findByIdAndUpdate(userId, { $set: {age}},{new: true});

    //save document 수정하기. 
    let user = await User.findById(userId);
    console.log({ userBeforeEdit: user });
    if (age) user.age = age;

    //ch7 챌린지 변경 작업중. 
    if (name) {
      user.name = name;
      await Promise.all([
        Blog.updateMany({ "user._id": userId }, { "user.name": name }),
        Blog.updateMany(
          {},
          { "comments.$[comment].userFullName": `${name.first} ${name.last}` },
          { arrayFilters: [{ "comment.user": userId }] }
        ),
      ]);
    }
    // console.log({ userAfterEdit: user });

    // 호출은 save 이지만, 실제 작업은 업데이트로 처리가 됨. 
    await user.save()
    return res.send({ user })

  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message })
  }
})
// 컴파스에서 필터에서 검색시 아이디가 필요 {_id:ObjectId('63eac7c361ccf46fbdda117d')}

//외부에서 가져쓰기 위해 설정.
module.exports = {
  userRouter,
}

