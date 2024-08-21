// import {sessionsCollection} from "../db/mongo-db";
import { injectable } from "inversify";
import { SessionModel } from "../db/schema-model-db";
import { ISessionsRepository } from "./sessionsInterface";

@injectable()
export class SessionsRepository implements ISessionsRepository{
    async deleteSessionById(deviceId: string) {
        const result = await SessionModel.deleteOne({ device_id: deviceId });
        return result.deletedCount === 1;
    }
    async deleteAllSessionsExceptCurrentOne(userId: string, device_id: string) {
        const deleteAllDevices = await SessionModel.deleteMany({ user_id: userId, device_id: { $ne: device_id } });
        return deleteAllDevices.deletedCount > 0;
    }
    async findSessionByMiddleware (deviceId: string) {
        const user = await SessionModel.findOne({device_id: deviceId});
        if(user) {
            return user
        } else {
            return null
        }
    }
    async findUserByDeviceId(deviceId: string) {
        const session = await SessionModel.findOne({ device_id: deviceId });
        return session || null
    }
}