
// 3개 모듈을 exports 하는 것을 하나로 리팩토링
module.exports = {
  ...require("./blogRoute"),
  ...require("./commentRoute"),
  ...require("./userRoute"),
};