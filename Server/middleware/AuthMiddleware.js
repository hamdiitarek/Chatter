import jwt from 'jsonwebtoken';

export const verifyToken = (request, response, next) => {
    const token = request.cookies.jwt;

    if (!token) {
        return response.status(403).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return response.status(401).json({ message: "Unauthorized" });
        }
        request.userId = decoded.id; 
        next();
    });
};