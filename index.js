const express = require('express');
const app = express();
require('dotenv').config();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 유저 모델
const { User } = require('./models/User');

const mongoose = require('mongoose');
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('연결됨'))
  .catch((err) => console.log(err));

const port = 3100;

app.get('/', (req, res) => res.send('Hello'));

app.post('/register', (req, res) => {
  const user = new User(req.body);

  // 회원 가입 시 데이터 저장
  // 회원 가입 실패하면 false
  // 회원 가입 성공하면 true
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
