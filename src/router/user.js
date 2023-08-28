const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  userAdd,
  userLogin,
  userLogout,
  userLogoutAll,
  allUsersList,
  userById,
  userUpdate,
  userDelete,
  uploadAvatar,
  deleteAvatar,
  getUserAvatar,
  upload,
} = require('../controller/user');

router.post('/users', userAdd);

router.post('/user/login', userLogin);

router.post('/user/logout', auth, userLogout);

router.post('/user/logoutAll', auth, userLogoutAll);

router.get('/allusers', auth, allUsersList);

router.get('/user/:id', auth, userById);

router.put('/user/:id', auth, userUpdate);

router.delete('/user/:id', auth, userDelete);

router.post('/user/:id/avatar', auth, upload.single('avatar'), uploadAvatar);

router.delete('/user/:id/avatar', auth, deleteAvatar);

router.get('/user/:id/avatar', auth, getUserAvatar);

module.exports = router;
