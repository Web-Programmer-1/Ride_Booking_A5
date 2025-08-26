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
const allowedOrigins = [
    "http://localhost:5173",
    "https://batch-5-a2-ride-share-booking.vercel.app"
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
// app.set("trust proxy", 1);
// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "https://batch-5-a2-ride-share-booking.vercel.app",
//   ],
//   credentials: true, 
// }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/v1/user", user_route_1.default);
app.use("/api/v1/ride", ride_route_1.default);
app.use(globalErrorHandler_1.globalErrorHandler);
app.get("/", (_req, res) => res.send("Ride Api is Working"));
exports.default = app;
exports.handler = app;
