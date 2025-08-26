
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import userRouter from "./modules/user/user.route";
import rideRouter from "./modules/ride/ride.route";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { issueCsrf } from "./middlewares/csrf.middleware";

config();
const app = express();

app.set("trust proxy", 1);

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://ride-booking-frontend.vercel.app",
  ],
  credentials: true, 
}));

app.use(express.json());
app.use(cookieParser());
app.use(issueCsrf)

app.use("/api/v1/user", userRouter);
app.use("/api/v1/ride", rideRouter);

app.use(globalErrorHandler);

app.get("/", (_req, res) => res.send("Ride Api is Working"));

export default app;
export const handler = app;
