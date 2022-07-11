import express from 'express';
import UserController from '@/controllers/user';
const router = express.Router();
const userController = new UserController();

router.post('/sign-up', userController.signUp);
router.post('/sign-in', userController.SignIn);

export default router;