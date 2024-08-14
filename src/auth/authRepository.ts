import { ObjectId } from "mongodb";
// import { /*tokenCollection,*/ apiCollection, sessionsCollection, userCollection } from "../db/mongo-db";
import { UserDBModel } from "../input-output-types/users-type";
import { SessionsType } from "../input-output-types/sessions-types";
import { ApiModel, SessionModel, UserModel } from "../db/schema-model-db";

export class AuthRepository {
    static async updateCode(userId: string, newCode: string) {
        const result = await UserModel.updateOne({_id: userId}, {$set: {'emailConfirmation.confirmationCode': newCode}})
        return result.modifiedCount === 1;
    }
    static async updatePassword(userId: string, pass: string) {
        const result = await UserModel.updateOne({_id: userId}, {$set: {password: pass}})
        return result.modifiedCount === 1;
    }
    static async checkUserByRegistration (login: string, email: string) {
        return UserModel.findOne({ $or: [{ login: login }, { email: email }] });
    }
    static async findUserByLoginOrEmail (loginOrEmail: string) {
        return UserModel.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] });
    }
    static async createUser (user: UserDBModel) {
        const saveResult = await UserModel.create(user);
        return saveResult._id.toString();
    }
    static async findUserByCode (code: string) {
        return UserModel.findOne({"emailConfirmation.confirmationCode": code});
    }
    static async findUserByEmail (mail: string) {
        return UserModel.findOne({email: mail});
    }
    // static async resendMail (mail: string) {
    //     return UserModel.findOne({email: mail});
    // }
    static async updateConfirmation (_id: ObjectId) {
        const result = await UserModel.updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1;
    }
    static async createSession (session: SessionsType) {
        const saveResult = await SessionModel.create(session);
        return saveResult._id.toString();
    }
    static async findSessionFromDeviceId (deviceId: string) {
        return SessionModel.findOne({device_id: deviceId})
    }
    static async updateIat (iat: string,deviceId: string) {
        return SessionModel.updateOne({device_id: deviceId}, { $set: { iat: iat }})
    }
    static async deleteSession (deviceId: string) {
        const result = await SessionModel.deleteOne({device_id: deviceId});
        if(result.deletedCount === 1) {
            return true
        } else {
            return false
        } 
    }
    static async dataRecording (ip: string, url: string, currentDate: Date) {
        const result = await ApiModel.create({ip: ip, URL: url, date: currentDate})
        return result._id.toString()
    }
    static async countingNumberRequests (ip: string, url: string, tenSecondsAgo: Date) {
        const filterDocument = {
            ip: ip,
            URL: url,
            date: { $gte: tenSecondsAgo }
        }
        return ApiModel.countDocuments(filterDocument)

    }
    // static async findRefreshTokenFromDB (token: string) {
    //     return tokenCollection.findOne({token: token});
    // }
    // static async insertTokenFromDB (token: string) {
    //     const saveResult = await tokenCollection.insertOne({token});
    //     return saveResult.insertedId.toString();
    // }
}