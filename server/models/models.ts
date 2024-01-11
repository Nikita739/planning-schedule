import sequelize from '../db';
import {DataTypes, Model, ModelStatic} from "sequelize";

const User: ModelStatic<Model> = sequelize.define('user', {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    username: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
});

export default {
    User
};