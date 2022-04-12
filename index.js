const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
    cors({
      origin: ['http://localhost:3000'],
      credentials: true,
    }),
);

const { auth } = require('./middleware/auth');
// 유저 모델
const { User } = require('./models/User');

const mongoose = require('mongoose');
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('연결됨'))
  .catch((err) => console.log(err));

const port = 3100;

app.get('/', (req, res) => res.send('Hello'));

// FIXME: router
app.post('/api/register', (req, res) => {
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
});

app.post('/api/login', (req, res) => {
  // 요청된 이메일을 데이터 베이스에 있는지 찾는다
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '제공된 이메일에 해당하는 유저가 없습니다.',
      });
    }
    // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는지 확인

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: '비밀번호가 틀렸습니다.',
        });
      }

      // 비밀번호까지 맞다면 토큰을 생성하기
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 쿠키에 저장
        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get('/api/users/auth', auth, (req, res) => {
  // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 true라는 것을 의미

  res.status(200).json({
    _id: req.user._id,
    // TODO: ROLE -> 1 Admin
    // role -> 0 일반유저
    // role이 0이 아니면 관리자
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndDelete(
    {
      _id: req.user._id,
    },
    { token: '' },
    (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));
