const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

const CommentSchema = new Schema(
  {
    content: { type: String, required: true },

    // userFullName: {type: String, required: true},
    // user: { type: ObjectId, required: true, ref: "user" },

    //ch7 추가 작업중
    //ex1
    // user:
    // {
    //   _id: { type: Types.ObjectId, required: true, ref: "user" },
    //   username: { type: String, required: true },
    //   name: {
    //     first: { type: String, required: true },
    //     last: { type: String, required: true },
    //   },
    // },

    //ex2


    // user: { type: ObjectId, required: true, ref: "user" },

    // ch8 인덱스 추가하기
    user: { type: ObjectId, required: true, ref: "user", index: true },
    userFullName: { type: String, required: true },
    blog: { type: ObjectId, required: true, ref: "blog" },
  },
  { timestamps: true }
);

//ch9 작업중.
CommentSchema.index({ blog: 1, createdAt: -1 });

const Comment = model("comment", CommentSchema);

module.exports = {
  Comment, CommentSchema
};
