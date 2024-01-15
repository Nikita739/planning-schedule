import sequelize from '../db';
import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional} from "sequelize";

// @ts-nocheck

export interface IUser extends Model<InferAttributes<IUser>, InferCreationAttributes<IUser>> {
    id: number;
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

User.hasMany(Token);
Token.belongsTo(User);

export default {
    User,
    Token
};