import { ObjectId } from "mongodb";
import { UserDBModel } from "../input-output-types/users-type";
import { SessionsType } from "../input-output-types/sessions-types";
import { ApiModel, SessionModel, UserModel } from "../db/schema-model-db";

export class AuthRepository {
    async updateCode(userId: string, newCode: string) {
        const result = await UserModel.updateOne({ _id: userId }, { $set: { 'emailConfirmation.confirmationCode': newCode } });
        return result.modifiedCount === 1;
    }
    async updatePassword(userId: string, pass: string) {
        const result = await UserModel.updateOne({ _id: userId }, { $set: { password: pass } });
        return result.modifiedCount === 1;
    }
    async checkUserByRegistration(login: string, email: string) {
        return UserModel.findOne({ $or: [{ login: login }, { email: email }] });
    }
    async findUserByLoginOrEmail(loginOrEmail: string) {
        return UserModel.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] });
    }
    async createUser(user: UserDBModel) {
        const saveResult = await UserModel.create(user);
        return saveResult._id.toString();
    }
    async findUserByCode(code: string) {
        return UserModel.findOne({ "emailConfirmation.confirmationCode": code });
    }
    async findUserByEmail(mail: string) {
        return UserModel.findOne({ email: mail });
    }
    async updateConfirmation(_id: ObjectId) {
        const result = await UserModel.updateOne({ _id }, { $set: { 'emailConfirmation.isConfirmed': true } });
        return result.modifiedCount === 1;
    }
    async createSession(session: SessionsType) {
        const saveResult = await SessionModel.create(session);
        return saveResult._id.toString();
    }
    async findSessionFromDeviceId(deviceId: string) {
        return SessionModel.findOne({ device_id: deviceId });
    }
    async updateIat(iat: string, deviceId: string) {
        return SessionModel.updateOne({ device_id: deviceId }, { $set: { iat: iat } });
    }
    async deleteSession(deviceId: string) {
        const result = await SessionModel.deleteOne({ device_id: deviceId });
        if (result.deletedCount === 1) {
            return true;
        } else {
            return false;
        }
    }
    async resendMail (mail: string) {
        return UserModel.findOne({email: mail});
    }
    async dataRecording(ip: string, url: string, currentDate: Date) {
        const result = await ApiModel.create({ ip: ip, URL: url, date: currentDate });
        return result._id.toString();
    }
    async countingNumberRequests(ip: string, url: string, tenSecondsAgo: Date) {
        const filterDocument = {
            ip: ip,
            URL: url,
            date: { $gte: tenSecondsAgo }
        };
        return ApiModel.countDocuments(filterDocument);
    }
}