"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const user_model_1 = require("./user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../../util/jwt");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = yield user_model_1.User.findOne({ email: email });
        if (existingUser) {
            return res.json({
                message: "Email Already Exiting"
            });
        }
        ;
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield user_model_1.User.create({
            name: name,
            email: email,
            password: hashedPassword,
            role: role,
        });
        res.status(201).json({
            sucess: true,
            message: "User created Sucessfully",
            data: user
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                message: "Email is not found!"
            });
        }
        ;
        const isMatchPass = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatchPass) {
            return res.json({
                message: "Pass did't match"
            });
        }
        ;
        if (user.isBlocked) {
            return res.json({
                message: "User is Blocked!"
            });
        }
        ;
        const token = (0, jwt_1.generateToken)({
            id: user._id,
            role: user.role,
        });
        res.status(200).json({
            sucess: true,
            message: "Login sucessfully",
            token: token
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.login = login;
