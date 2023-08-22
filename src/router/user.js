const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controller/user');

router.post('/users', userController.userAdd);

router.post('/user/login', userController.userLogin);

router.post('/user/logout', auth, userController.userLogout);

router.post('/user/logoutAll', auth, userController.userLogoutAll);

router.get('/allusers', auth, userController.allUsersList);

router.get('/user/:id', userController.userById);

router.put('/user/:id', userController.userUpdate);

router.delete('/user/:id', userController.userDelete);

module.exports = router;
