import { Request, Response, NextFunction } from 'express';
import { PlatformPath } from 'path';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line no-shadow
    interface Request {
      filePath: PlatformPath;
    }
  }
}

function filePath(path: PlatformPath) {
  return (req: Request, res: Response, next: NextFunction): void => {
    req.filePath = path;
    next();
  };
}

export default filePath;
