import { inject, injectable } from "inversify";
import { ISessionsRepository, ISessionsService, TYPES } from "./sessionsInterface";

@injectable()
export class SessionsService implements ISessionsService {

    constructor(@inject(TYPES.ISessionsRepository) private sessionsRepository: ISessionsRepository) {}

    async deleteAllSessionsExceptCurrentOne(userId: string, device_id: string) {
        const result = await this.sessionsRepository.deleteAllSessionsExceptCurrentOne(userId, device_id);
        return result;
    }
    async deleteSessionById(deviceId: string) {
        const result = await this.sessionsRepository.deleteSessionById(deviceId);
        return result;
    }
    async findUserByDeviceId(deviceId: string) {
        const result = await this.sessionsRepository.findUserByDeviceId(deviceId);
        return result
    }
}