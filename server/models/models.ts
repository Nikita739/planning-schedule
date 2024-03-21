import sequelize from '../db';
import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional} from "sequelize";

// @ts-nocheck

export interface IUser extends Model<InferAttributes<IUser>, InferCreationAttributes<IUser>> {
    id: CreationOptional<number>;
    username: string;
    email: string;
    password: string;
}

const User = sequelize.define<IUser>('user', {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    username: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
});

export interface ISettings extends Model<InferAttributes<ISettings>, InferCreationAttributes<ISettings>> {
    id: CreationOptional<number>;
    userId: number;
    priorityColors?: string[];
}

const Settings = sequelize.define<ISettings>('settings', {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    userId: {type: DataTypes.BIGINT, allowNull: false},
    priorityColors: {type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: true, defaultValue: ["#33ff44", "#fffc3b", "#ff5b3b"]}
});

export interface IToken extends Model<InferAttributes<IToken>, InferCreationAttributes<IToken>> {
    id: CreationOptional<number>;
    refreshToken: string;
    userId: number;
}

const Token = sequelize.define<IToken>("token", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    refreshToken: {type: DataTypes.TEXT, allowNull: false},
    userId: {type: DataTypes.BIGINT, allowNull: false}
});

export interface IEvent extends Model<InferAttributes<IEvent>, InferCreationAttributes<IEvent>> {
    id: CreationOptional<number>;
    name: string;
    description: string | null;
    date: string;
    userId: number;
    endDate: string;
    priority?: 1 | 2 | 3;
}

const Event = sequelize.define<IEvent>("event", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    date: {type: DataTypes.DATE, allowNull: false},
    name: {type: DataTypes.TEXT, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: true, defaultValue: null},
    userId: {type: DataTypes.BIGINT, allowNull: false},
    endDate: {type: DataTypes.DATE, allowNull: false},
    priority: {type: DataTypes.INTEGER, allowNull: true, defaultValue: 2}
});

export interface IRepeatWeekly extends Model<InferAttributes<IRepeatWeekly>, InferCreationAttributes<IRepeatWeekly>> {
    id: CreationOptional<number>;
    day: number; // [0 1 ... 6] = day indexes, can be retrieved from the date.getDay() function
    hour: number;
    eventId: number;
    userId: number;
}

const RepeatWeekly = sequelize.define<IRepeatWeekly>("repeatWeekly", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    day: {type: DataTypes.INTEGER},
    hour: {type: DataTypes.INTEGER},
    eventId: {type: DataTypes.BIGINT},
    userId: {type: DataTypes.BIGINT}
});

User.hasMany(Token);
Token.belongsTo(User);

User.hasMany(Event);
Event.belongsTo(User);

User.hasMany(RepeatWeekly);
RepeatWeekly.belongsTo(User);

Event.hasOne(RepeatWeekly);
RepeatWeekly.belongsTo(Event);

export default {
    User,
    Token,
    Event,
    Settings,
    RepeatWeekly
};