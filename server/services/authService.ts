import Models, {ISettings, IToken, IUser} from '../models/models';
import ApiError from "../exeptions/apiError";
import bcrypt from 'bcrypt';
import tokenService, {AuthTokens} from "./tokenService";
import UserDto, {IUserDto} from "../dtos/userDto";
import uuid from 'uuid';
import {JwtPayload} from "jsonwebtoken";

const {User, Settings} = Models;

export interface AuthResult {
    user: IUserDto;
    accessToken: string;
    refreshToken: string;
    settings: ISettings
}

export default new class AuthService {
    async registration(username: string, email: string, password: string): Promise<AuthResult> {
        const candidate: IUser | null = await User.findOne({where: {email}});
        if(candidate) {
            throw ApiError.BadRequest('User with this email already exists');
        }

        const hashPassword = await bcrypt.hash(password, 4);

        const user: IUser = await User.create({username, email, password: hashPassword});
        const settings = await Settings.create({userId: user.id});

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto, settings: settings};
    }

    async login(email: string, password: string): Promise<AuthResult> {
        const candidate: IUser | null = await User.findOne({where: {email}});
        if(!candidate) {
            throw ApiError.BadRequest('Incorrect email or password');
        }

        const result: boolean = bcrypt.compareSync(password, candidate.password);

        if(!result) throw ApiError.BadRequest('Incorrect email or password');

        // Password correct
        const userDto: IUserDto = new UserDto(candidate);
        const tokens: AuthTokens = tokenService.generateTokens({...userDto});

        const settings = await Settings.findOne({where: {userId: candidate.id}});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto, settings: settings!};
    }

    async logout(refreshToken: string): Promise<number> {
        return await tokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken: string): Promise<AuthResult> {
        if(!refreshToken) {
            throw ApiError.BadRequest("Refresh token not specified");
        }

        const userData: string | JwtPayload | null = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb: IToken | null = await tokenService.findToken(refreshToken);

        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user: IUser | null = await User.findOne({where: {id: userData.id}});
        if(!user) {
            throw ApiError.UnauthorizedError();
        }

        const userDto = new UserDto(user);
        const tokens: AuthTokens = tokenService.generateTokens({...userDto});

        const settings = await Settings.findOne({where: {userId: user.id}});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto, settings: settings!};
    }
}