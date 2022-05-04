const { User } = require('../../models/User');

module.exports = async (req, res, next) => {
  const user = new User(req.body);

  // 회원 가입 시 데이터 저장
  // 회원 가입 실패하면 false
  // 회원 가입 성공하면 true
  user.save((err, userInfo) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, err });
    }
    return res.status(200).json({
      success: true,
    });
  });
};
