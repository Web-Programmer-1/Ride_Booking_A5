"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const checkRole = (roles) => {
    return (req, res, next) => {
        var _a;
        const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        if (!roles.includes(userRole)) {
            return res.status(403).json({ message: 'Forbidden: Access denied' });
        }
        next();
    };
};
exports.checkRole = checkRole;
