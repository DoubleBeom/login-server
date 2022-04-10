const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

// FIXME: Mongoose는 화살표 함수를 사용하면 안된다는 이슈가 있음
// https://stackoverflow.com/questions/40161459/user-ismodified-is-not-a-function-when-doing-a-pre-update-in-mongoose
userSchema.pre('save', function (next) {
  let user = this;

  if (user.isModified('password')) {
    // 비밀번호 암호화
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// 비밀번호 비교하는 method 생성
userSchema.methods.comparePassword = function (plainPassword, cb) {
  // 현재 비밀번호와 암호화된 비밀번호가 맞는지 확인
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  let user = this;

  // jsonwebtoken을 이용해서 token을 생성
  let token = jwt.sign(user._id.toHexString(), 'secretToken');

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
