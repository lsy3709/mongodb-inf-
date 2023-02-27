// 몽구스를 불러와서
// 스키마, 모델, 타입스 만들기. 

const { Schema, model, Types } = require("mongoose");

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    islive: { type: Boolean, required: true, default: false },
    user: new Schema({

      _id: { type: Types.ObjectId, required: true, ref: 'user' },

      username: { type: String, required: true },

      name: {

        first: { type: String, required: true },

        last: { type: String, required: true },

      },

    }),
  },
  { timestamps: true }
);

const Blog = model("blog", BlogSchema);

module.exports = {
  Blog
};
