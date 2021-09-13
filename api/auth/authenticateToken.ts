import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
export default function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction,
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) {
    res.status(401).json({code: 401, msg: 'E_BEARER_TOKEN_UNFOUND'});
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, result)=>{
    if (err) {
      res.status(403).json({code: 403, msg: 'E_INVALID_TOKEN'});
    }
    req.userId=result.user;
    next();
  });
};
