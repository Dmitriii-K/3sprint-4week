import { WithId } from "mongodb";
// import {sessionsCollection} from "../db/mongo-db";
import { DeviceViewModel } from "../input-output-types/device-type";
import { SessionsType } from "../input-output-types/sessions-types";
import { SessionModel } from "../db/schema-model-db";

export class SessionsQueryRepository {
    static async findSessions (userId: string): Promise<DeviceViewModel[] | null> {
        // console.log(userId)
        if (!userId) {
            throw new Error("User ID is required");
        }
        const currentTime = new Date().toISOString();
        const sessions = await SessionModel.find({user_id: userId, exp: {$gte: currentTime}}).exec();
        // console.log(sessions)
        return sessions.map(SessionsQueryRepository.mapSession)
    }
    static mapSession (session: WithId<SessionsType>): DeviceViewModel {
        return {
            ip: session.ip,
            title: session.device_name,
            lastActiveDate: session.iat,
            deviceId: session.device_id
        }
    }
}