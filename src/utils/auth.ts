import jwt from 'jsonwebtoken';
import { Request } from 'express';

const secret = 'your_secret_key'; // Use an environment variable in production
const expiration = '2h';

export const authMiddleware = ({ req }: { req: Request }) => {
    let token = req.headers.authorization || '';

    if (token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
    }

    if (!token) {
        return req;
    }

    try {
        const { data } = jwt.verify(token, secret) as any;
        req.user = data;
    } catch {
        console.log('Invalid token');
    }

    return req;
};

export const signToken = (user: any) => {
    return jwt.sign({ data: user }, secret, { expiresIn: expiration });
};
