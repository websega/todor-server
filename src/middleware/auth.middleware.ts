import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';

type UserType = {
  id?: string;
};

interface IUserAuthRequest extends Request {
  user?: UserType | string;
}

export default (
  req: IUserAuthRequest,
  res: Response,
  next: NextFunction
): Response | void => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Auth error' });
    }

    const decoded = jwt.verify(token, config.get('secretKey'));

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Auth error' });
  }
};
