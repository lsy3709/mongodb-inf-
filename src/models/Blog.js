// 몽구스를 불러와서
// 스키마, 모델, 타입스 만들기. 

const { Schema, model, Types } = require("mongoose");

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    islive: { type: Boolean, required: true, default: false },
    user: { type: Types.ObjectId, required: true, ref: "user" },
  },
  { timestamps: true }
);

// 가상키 추가 작업1. 가상 필드. 디비 저장 x
BlogSchema.virtual("comments", {
  ref: "comment",
  localField: "_id",
  foreignField: "blog",
});


// 가상키 추가 작업2. 가상 필드.디비 저장 x
BlogSchema.set("toObject", { virtuals: true });
BlogSchema.set("toJSON", { virtuals: true });

const Blog = model("blog", BlogSchema);

module.exports = {
  Blog
};
