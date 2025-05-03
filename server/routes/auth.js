const auth = require('../controller/user.controller');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router();

router.post('/login', loginValidation, auth.login);
router.post('/signup', signupValidation, auth.signup);

module.exports = router;