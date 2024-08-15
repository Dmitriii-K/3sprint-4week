import { WithId } from "mongodb";
import { DeviceViewModel } from "../input-output-types/device-type";
import { SessionsType } from "../input-output-types/sessions-types";
import { SessionModel } from "../db/schema-model-db";

export class SessionsQueryRepository {
    async findSessions(userId: string): Promise<DeviceViewModel[] | null> {
        if (!userId) {
            throw new Error("User ID is required");
        }
        const currentTime = new Date().toISOString();
        const sessions = await SessionModel.find({ user_id: userId, exp: { $gte: currentTime } }).exec();
        return sessions.map(this.mapSession);
    }
    mapSession(session: WithId<SessionsType>): DeviceViewModel {
        return {
            ip: session.ip,
            title: session.device_name,
            lastActiveDate: session.iat,
            deviceId: session.device_id
        };
    }
}