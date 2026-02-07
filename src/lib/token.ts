import jwt from 'jsonwebtoken';

const generateToken = (userId: string) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

export const verifyToken = (token: string) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
        return decoded;
    } catch (error) {
        return null;
    }
};

export default generateToken;
