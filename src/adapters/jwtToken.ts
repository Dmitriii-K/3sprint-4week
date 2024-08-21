import  jwt from 'jsonwebtoken';
import { SETTINGS } from '../settings';
import { UserDBModel } from '../input-output-types/users-type';
import {  WithId } from 'mongodb';
import { randomUUID } from 'crypto';
import { IJwtService } from '../auth/authInterface';
import { injectable } from 'inversify';

export type PayloadType  = {
userId: string;
email: string,
login: string,
deviceId: string,
}

export type SystemPayload = {
iat: any
exp: any
}

export type UnionPayload = PayloadType & SystemPayload

// export const jwtService = {
// generateToken (user: WithId<UserDBModel>, deviceId?: string) {

//   const payload: PayloadType = {
//     userId: user._id.toString(),
//     email: user.email,
//     login: user.login,
//     deviceId:deviceId ?? randomUUID()
//   };
//   const optionsAccessToken = {
//     expiresIn: '6000' 
//   };
//   const optionsRefreshToken = {
//     expiresIn: '8000' 
//   };
//   const secretKey = SETTINGS.JWT_SECRET_KEY; 
//   const accessToken:string = jwt.sign(payload, secretKey, optionsAccessToken);
//   const refreshToken:string = jwt.sign(payload, secretKey, optionsRefreshToken);
//   return {accessToken, refreshToken};
// },
// getUserIdByToken (token:string) : UnionPayload | null {
//     try {
//     return jwt.verify(token, SETTINGS.JWT_SECRET_KEY) as unknown as UnionPayload;
//     } catch (error) {
//         return null;
//       }
//   }
// }

@injectable()
export class JwtService implements IJwtService {
generateToken(user: WithId<UserDBModel>, deviceId?: string): { accessToken: string, refreshToken: string } {
    const payload: PayloadType = {
        userId: user._id.toString(),
        email: user.email,
        login: user.login,
        deviceId: deviceId ?? randomUUID()
    };
    const optionsAccessToken = {
        expiresIn: '6000'
    };
    const optionsRefreshToken = {
        expiresIn: '8000'
    };
    const secretKey = SETTINGS.JWT_SECRET_KEY;
    const accessToken: string = jwt.sign(payload, secretKey, optionsAccessToken);
    const refreshToken: string = jwt.sign(payload, secretKey, optionsRefreshToken);
    return { accessToken, refreshToken };
}

getUserIdByToken(token: string): UnionPayload | null {
    try {
        return jwt.verify(token, SETTINGS.JWT_SECRET_KEY) as unknown as UnionPayload;
    } catch (error) {
        return null;
    }
}
}