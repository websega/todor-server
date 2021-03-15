import { Router, Request, Response } from 'express';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';

import config from 'config';

import User from '../models/User';

import authMiddleware from '../middleware/auth.middleware';

const authRouter = Router();

authRouter.post(
  '/registration',
  [
    check('email', 'Uncorrect email').isEmail(),
    check(
      'username',
      'Username mast be longer than 4 and shorter than 15'
    ).isLength({ min: 4, max: 15 }),
    check(
      'password',
      'Password mast be longer than 4 and shorter than 20'
    ).isLength({ min: 4, max: 20 }),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Uncorrect request', errors });
      }

      const { username, email, password } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: `User with email ${email} already exists` });
      }

      const hashPassword = await bcrypt.hash(password, 8);
      const user = new User({ username, email, password: hashPassword });
      await user.save();

      return res.json({ message: 'User was created' });
    } catch (error) {
      console.log(error);
      return res.send({ message: 'Server error' });
    }
  }
);

type Body = { email: string; password: string };

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password }: Body = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPassValid = bcrypt.compareSync(password, user.password);

    if (!isPassValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.secretKey || config.get('secretKey'),
      {
        expiresIn: '1h',
      }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.log(error);
    return res.send({ message: 'Server error' });
  }
});

type UserType = {
  id: string;
};

interface IUserAuthRequest extends Request {
  user?: UserType;
}

authRouter.get(
  '/auth',
  authMiddleware,
  async (req: IUserAuthRequest, res: Response) => {
    if (!req.user) {
      return null;
    }

    try {
      const user = await User.findOne({ _id: req.user.id });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.secretKey || config.get('secretKey'),
        {
          expiresIn: '1h',
        }
      );

      return res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      console.log(error);
      return res.send({ message: 'Server error' });
    }
  }
);

export default authRouter;
