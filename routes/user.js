const { Router } = require('express');
const router = Router();

const { userSignUp, userLogin, userLogout } = require('../controllers');

const { auth } = require('../middleware/auth');

// 유저 회원가입
router.post('/register', userSignUp);

// 유저 로그인
router.post('/login', userLogin);

// 유저 로그아웃
router.get('/logout', auth, userLogout);

module.exports = router;
