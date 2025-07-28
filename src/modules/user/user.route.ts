import express from 'express';
import { login, register } from './user.controller';
import { authGuard, AuthRequest } from '../../middlewares/auth.middleware';
import { checkRole } from '../../middlewares/role.middleware';

const userRouter = express.Router();


userRouter.post("/register", register);
userRouter.post("/login", login);


userRouter.get('/me', authGuard, checkRole(['admin', 'rider', 'driver']), (req, res) => {
  const request = req as AuthRequest;

  res.status(200).json({
    message: 'Profile info fetched successfully',
    user: request.user,
  });
});

export default userRouter;