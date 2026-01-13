import jwt from "jsonwebtoken";
export function authenticateSocket(req) {
    const url = new URL(req.url, "http://localhost");
    const token = url.searchParams.get("token");
    console.log(token);
    if (!token)
        return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=wsAuth.js.map