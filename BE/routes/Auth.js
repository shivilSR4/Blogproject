var express = require('express');
var router = express.Router();
const { Signup, Login } = require('../Controllers/AuthController');

/* GET home page. */

router.post('/register', Signup);
router.post('/login', Login);

module.exports = router;
