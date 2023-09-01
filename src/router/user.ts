import express from 'express';
const router = express.Router();
import auth from '../middleware/auth';
import {
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
} from '../controller/user';

router.post('/users', userAdd);

router.post('/user/login', userLogin);

router.post('/user/logout', auth, userLogout);

router.post('/user/logoutAll', auth, userLogoutAll);

router.get('/allusers', auth, allUsersList);

router
  .route('/user/:id')
  .get(auth, userById)
  .put(auth, userUpdate)
  .delete(auth, userDelete);

router
  .route('/user/:id/avatar')
  .post(auth, upload.single('avatar'), uploadAvatar)
  .delete(auth, deleteAvatar)
  .get(auth, getUserAvatar);

export default router;
