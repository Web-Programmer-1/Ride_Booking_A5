"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const userRouter = express_1.default.Router();
userRouter.post("/register", user_controller_1.register);
userRouter.post("/login", user_controller_1.login);
userRouter.get('/me', auth_middleware_1.authGuard, (0, role_middleware_1.checkRole)(['admin', 'rider', 'driver']), (req, res) => {
    const request = req;
    res.status(200).json({
        message: 'Profile info fetched successfully',
        user: request.user,
    });
});
exports.default = userRouter;
