
const authUser = require('../controllers/authUser');
const { Router } = require('express');
const router = Router();




router.get('/login', authUser.login)

router.get('/callback', authUser.callback)

module.exports = router;