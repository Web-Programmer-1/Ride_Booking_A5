"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authGuard = (req, res, next) => {
    var _a;
    const tokenFromCookie = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a["access-token"];
    const header = req.headers.authorization;
    const tokenFromHeader = (header === null || header === void 0 ? void 0 : header.startsWith("Bearer ")) ? header.split(" ")[1] : undefined;
    const token = tokenFromCookie || tokenFromHeader;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access: Token missing" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (_b) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.authGuard = authGuard;
