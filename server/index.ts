import errorMiddleware from "./middleware/errorMiddleware";
import express, {NextFunction, Request, Response} from "express";
import sequelize from './db';
import router from "./routes/index";
import cookieParser from 'cookie-parser';
import WebSocket from 'ws';
import cron from 'node-cron';
import models from "./models/models";

require("dotenv").config();

const {Event} = models;

const app = express();
const PORT: number = Number(process.env.PORT) || 4000;

app.use(express.json());
app.use(cookieParser());
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

const wss = new WebSocket.Server({
    port: 4040
}, () => console.log("WebSocketServer started"));

function dateToCron(date: Date): string {
    const minute = date.getMinutes();
    const hour = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    const dayOfWeek = date.getDay();

    return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
}

wss.on('connection', function connection(ws) {
    ws.on('message', async function message(rawData: string) {
        const data = JSON.parse(rawData);
        if(!data) return;

        const userId = data.id || 0;
        const scheduledEvents = await Event.findAll({where: {userId: userId}});

        // scheduledEvents.forEach((event) => {
        //     const startDate = new Date(event.date);
        //
        //
        //
        //     cron.schedule(dateToCron(startDate), () => {
        //         console.log("CRON RUNNING EVERY MINUTE");
        //         ws.send("CRON RESPONSE");
        //     });
        // });
        const testDate = new Date();
        testDate.setMinutes(testDate.getMinutes() + 1);

        cron.schedule("* * * * *", () => {
            const testResponse = {
                type: "testResponse",
                content: {
                    message: "Hello world!"
                }
            };
            ws.send(JSON.stringify(testResponse));
        });

        console.log('received: %s', data);
    });
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