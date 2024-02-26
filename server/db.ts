import {Sequelize} from "sequelize";

export default new Sequelize(
    "planning-schedule",
    "postgres",
    "123N456N789n",
    {
        dialect: 'postgres',
        host: "localhost",
        port: 5432
    }
);