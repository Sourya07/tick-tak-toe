import jwt from "jsonwebtoken";

interface JwtPayload {
    userId: string;
}

export function authenticateSocket(req: any) {
    const url = new URL(req.url, "http://localhost");
    const token = url.searchParams.get("token");
    console.log(token)
    if (!token) return null;

    try {
        const JWT_SECRET = "supersecretkey123";
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
        return null;
    }
}