"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = require("dotenv");
const user_route_1 = __importDefault(require("./modules/user/user.route"));
const ride_route_1 = __importDefault(require("./modules/ride/ride.route"));
const globalErrorHandler_1 = require("./middlewares/globalErrorHandler");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// User Router Middlewares 
app.use("/api/v1/user", user_route_1.default);
// User Router Middlewares
app.use("/api/v1/ride", ride_route_1.default);
app.use(globalErrorHandler_1.globalErrorHandler);
app.get("/", (req, res) => {
    res.send("Ride Api is Working");
});
exports.default = app;
exports.handler = app;
