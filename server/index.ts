require("dotenv").config();

import express, { Express, Request, Response } from "express";
import sequelize from './db';

const app = express();
const PORT: number = Number(process.env.PORT) || 4000;

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