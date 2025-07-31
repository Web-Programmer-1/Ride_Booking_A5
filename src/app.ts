import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config} from 'dotenv';
import userRouter from './modules/user/user.route';
import rideRouter from './modules/ride/ride.route';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());


// User Router Middlewares 
app.use("/api/v1/user", userRouter);

// User Router Middlewares
app.use("/api/v1/ride", rideRouter);

app.use(globalErrorHandler);





app.get("/", (req, res) => {
    res.send("Ride Api is Working")
});

export default app;
export const handler = app; 
