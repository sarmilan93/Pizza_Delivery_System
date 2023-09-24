import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'inventory';

interface DecodedUser {
    userId: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: DecodedUser;
        }
    }
}

// Middleware to verify JWT and check user role
export const authenticateUser = (requiredRole: string | string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {

        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized - Token missing' });
        }

        try {
            const decoded: any = jwt.verify(token, JWT_SECRET);
            if (typeof requiredRole === 'string' && decoded.role !== requiredRole) {
                return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
            }

            if (Array.isArray(requiredRole) && !requiredRole.includes(decoded.role)) {
                return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
            }

            req.user = decoded;

            next();
        } catch (error) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }
    };
};

export const getStaff = (req: Request, res: Response) => {
    try {
        const token = req.cookies.token;
        if (token) {
            const decoded: any = jwt.verify(token, JWT_SECRET);
            return decoded;
        }
        else {
            return "Missing Token";
        }
        
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};
