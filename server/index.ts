require("dotenv").config();

import express, { Express, Request, Response } from "express";
import sequelize from './db';
import router from "./routes/index";
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const PORT: number = Number(process.env.PORT) || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
    res.send("Hello world");
});

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