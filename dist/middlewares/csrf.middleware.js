"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCsrf = exports.issueCsrf = void 0;
const crypto_1 = __importDefault(require("crypto"));
const issueCsrf = (req, res, next) => {
    if (!req.cookies["csrf-token"]) {
        const token = crypto_1.default.randomBytes(20).toString("hex");
        res.cookie("csrf-token", token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            path: "/",
        });
    }
    next();
};
exports.issueCsrf = issueCsrf;
const verifyCsrf = (req, res, next) => {
    const cookieToken = req.cookies["csrf-token"];
    const headerToken = req.header("x-csrf-token");
    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
        return res.status(403).json({ message: "CSRF token invalid" });
    }
    next();
};
exports.verifyCsrf = verifyCsrf;
