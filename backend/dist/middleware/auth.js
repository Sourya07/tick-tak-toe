import jwt, { decode } from 'jsonwebtoken';
const JWT_SECRET = "supersecretkey123";
const authmiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authorization token missing"
        });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "Authorization token missing"
        });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log(decoded);
        console.log("req" + req);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};
export default authmiddleware;
//# sourceMappingURL=auth.js.map