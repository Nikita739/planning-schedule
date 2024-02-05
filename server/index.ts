import errorMiddleware from "./middleware/errorMiddleware";

require("dotenv").config();

import express, {Express, NextFunction, Request, Response} from "express";
import sequelize from './db';
import router from "./routes/index";
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const PORT: number = Number(process.env.PORT) || 4000;

// app.use(cors({
//     origin: "http://localhost:3000"
// }));
app.use(express.json());
app.use(cookieParser());
// app.use(cors({
//     credentials: true,
//     origin: process.env.CLIENT_URL
// }));
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Methods", "OPTIONS,POST,GET,PATCH");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
})
app.use('/api/v1', router);
app.use(errorMiddleware);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        app.listen(PORT, () => {
            console.log("SERVER STARTED AT PORT " + PORT);
        });
    } catch (e) {
        console.log(e);
    }
}

start().then();