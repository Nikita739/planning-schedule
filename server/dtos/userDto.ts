import {IUser} from "../models/models";

export interface IUserDto {
    id: number;
    username: string;
    email: string;
}

export default class UserDto {
    id: number;
    username: string;
    email: string;

    constructor(user: IUser) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
    }
}