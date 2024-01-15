import jwt, {JwtPayload} from 'jsonwebtoken';
import Models, {IToken} from '../models/models';

const {Token} = Models;

export interface AuthTokens {
    accessToken: string,
    refreshToken: string
}

class TokenService {
    generateTokens(payload: object): AuthTokens {
        const accessToken: string = jwt.sign(payload, "" + process.env.JWT_ACCESS_SECRET!, {expiresIn: '15m'});
        const refreshToken: string = jwt.sign(payload, "" + process.env.JWT_REFRESH_SECRET!, {expiresIn: '48h'});

        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId: number, refreshToken: string): Promise<IToken> {
        const tokenData: IToken | null = await Token.findOne({where: {userId}});
        if(tokenData) {
            tokenData.refreshToken = refreshToken;
            return await tokenData.save();
        }

        return await Token.create({userId, refreshToken});
    }

    async removeToken(refreshToken: string): Promise<number> {
        return await Token.destroy({where: {refreshToken}});
    }

    async findToken(refreshToken: string): Promise<IToken | null> {
        return await Token.findOne({where: {refreshToken}});
    }

    async validateAccessToken(token: string): Promise<JwtPayload| string | null> {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
        } catch (e) {
            return null;
        }
    }

    async validateRefreshToken(token: string): Promise<JwtPayload| string | null> {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
        } catch (e) {
            return null;
        }
    }

    async generateToken(payload: object, expiresIn='15m'): Promise<string> {
        return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {expiresIn: expiresIn});
    }

    async validateToken(token: string): Promise<JwtPayload | string | null> {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
        } catch (e) {
            return null;
        }
    }
}

export default new TokenService();