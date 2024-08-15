// import {sessionsCollection} from "../db/mongo-db";
import { SessionModel } from "../db/schema-model-db";

export class SessionsRepository {
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
        const user = await SessionModel.findOne({ device_id: deviceId });
        if(user) {
            return user
        } else {
            return null
        }
    }
}