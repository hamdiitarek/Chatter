import jwt from 'jsonwebtoken';

export const verifyToken = (request, response, next) => {
    // Check if authorization header exists
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return response.status(403).json({ message: "Authorization header not provided" });
    }

    // Assuming the format "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // Check if the token exists
    if (!token) {
        return response.status(403).json({ message: "No token provided" });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return response.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        // Assign decoded userId to request object for further use
        request.userId = decoded.userId;
        next(); // Proceed to the next middleware or route handler
    });
};
