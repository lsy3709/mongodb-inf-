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
      _id: { type: Types.ObjectId, required: true, ref: "user" },
      username: { type: String, required: true },
      name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
      },
    },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

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
