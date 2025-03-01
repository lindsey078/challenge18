import { AuthenticationError } from 'apollo-server-express';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken'; // ✅ FIXED

const secret = 'mysecretsshhhhh';
const expiration = '2h';

export interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware = ({ req }: { req: AuthRequest }) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop()?.trim();
  }

  if (!token) {
    return req;
  }

  try {
    const { data } = jwt.verify(token, secret) as { data: any };
    req.user = data;
  } catch {
    console.log('Invalid token');
  }

  return req;
};

const signToken = ({ username, email, _id }: any) => {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

export default {
  authMiddleware,
  signToken,
};
