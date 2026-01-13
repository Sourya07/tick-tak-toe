import type { NextFunction, Request, Response } from 'express';

import jwt, { decode } from 'jsonwebtoken';

const JWT_SECRET = "supersecretkey123"


interface JwtPayload {
    userId: string;
}


const authmiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authorization token missing"
        });
    }


    const token = authHeader.split(" ")[1]
    if (!token) {
        return res.status(401).json({
            message: "Authorization token missing"
        });
    }
    try {
        const decoded = jwt.verify(
            token,
            JWT_SECRET
        ) as JwtPayload
        console.log(decoded)
        console.log("req" + req)
        req.userId = decoded.userId;

        next();
    }
    catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

export default authmiddleware;