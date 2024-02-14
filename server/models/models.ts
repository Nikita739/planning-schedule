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
}

const Event = sequelize.define<IEvent>("event", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    date: {type: DataTypes.DATE, allowNull: false},
    name: {type: DataTypes.TEXT, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: true, defaultValue: null},
    userId: {type: DataTypes.BIGINT, allowNull: false},
    endDate: {type: DataTypes.DATE, allowNull: false},
});

User.hasMany(Token);
Token.belongsTo(User);

User.hasMany(Event);
Event.belongsTo(User);

export default {
    User,
    Token,
    Event
};