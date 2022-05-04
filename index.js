const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const routes = require('./routes');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);

const mongoose = require('mongoose');
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('연결됨'))
  .catch((err) => console.log(err));

const port = 3100;

app.use('/', routes);
app.get('/', (req, res) => res.send('Hello'));

// app.get('/api/users/auth', auth, (req, res) => {
//   // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 true라는 것을 의미

//   res.status(200).json({
//     _id: req.user._id,
//     // TODO: ROLE -> 1 Admin
//     // role -> 0 일반유저
//     // role이 0이 아니면 관리자
//     isAdmin: req.user.role === 0 ? false : true,
//     isAuth: true,
//     email: req.user.email,
//     name: req.user.name,
//     lastname: req.user.lastname,
//     role: req.user.role,
//     image: req.user.image,
//   });
// });

app.listen(port, () => console.log(`Listening on port ${port}`));
