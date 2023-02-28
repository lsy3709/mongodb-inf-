// 몽구스를 불러와서
// 스키마, 모델, 타입스 만들기. 

const { Schema, model, Types } = require("mongoose");

//ch7 comment 불러오기 
const { CommentSchema } = require('./Comment')

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    islive: { type: Boolean, required: true, default: false },
    user: {
      // ch8 인덱스 적용하기. 
      // ex1
      // _id: { type: Types.ObjectId, required: true, ref: "user", index: true },
      _id: { type: Types.ObjectId, required: true, ref: "user" },
      username: { type: String, required: true },
      name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
      },
    },
    // 내장 부분 일단 주석 처리. ch9
    // comments: [CommentSchema],
  },
  { timestamps: true }
);

// 다른 방법 생성 가능함. 
//ex1)
//BlogSchema.index({ updatedAt: 1 })
//ex2) 복합키
BlogSchema.index({ 'user._id': 1, updatedAt: 1 })

//ch8 text index 만들기. 
//BlogSchema.index({ title: "text" });

///ch8 text index 만들기.2 
BlogSchema.index({ title: "text", content: "text" });

//ex3) 유니크 키 
// BlogSchema.index({ 'user._id': 1, updatedAt: 1 }, { unique: true })

// 가상키 추가 작업1. 가상 필드. 디비 저장 x
// BlogSchema.virtual("comments", {
//   ref: "comment",
//   localField: "_id",
//   foreignField: "blog",
// });


// 가상키 추가 작업2. 가상 필드.디비 저장 x
// BlogSchema.set("toObject", { virtuals: true });
// BlogSchema.set("toJSON", { virtuals: true });

const Blog = model("blog", BlogSchema);

module.exports = {
  Blog
};
