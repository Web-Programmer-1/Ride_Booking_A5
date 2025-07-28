import { Server } from "http"
import mongoose from "mongoose";
import app from "./app";
import { config } from "dotenv";
config();

const port = process.env.PORT || 5000;
const DB = process.env.DATABASE_URL!;
let server:Server;
const bootstrap = async () => {
    try {
        await mongoose.connect(DB);
        console.log("Connceted Mongoose Server");
        server=app.listen(port, () => {
            console.log(`Server is running on the PORT:${port}`)
        })
    } catch (error) {
        console.log(error)
        
    }

};

bootstrap();