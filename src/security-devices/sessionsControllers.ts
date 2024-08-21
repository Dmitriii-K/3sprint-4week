import { Request, Response } from "express";
import { DeviceViewModel } from "../input-output-types/device-type";
import { ISessionsQueryRepository, ISessionsService, TYPES } from "./sessionsInterface";
import { inject, injectable } from "inversify";

@injectable()
export class SessionsControllers {

    constructor(
        @inject(TYPES.ISessionsService) private sessionsService: ISessionsService,
        @inject(TYPES.ISessionsQueryRepository) private sessionsQueryRepository: ISessionsQueryRepository) {}

    async deleteAllSessionsExceptCurrentOne(req: Request, res: Response) {
        try {
            const userId = req.user._id;
            const device_id = req.deviceId;

            const result = await this.sessionsService.deleteAllSessionsExceptCurrentOne(userId, device_id);
            if (result) {
                res.sendStatus(204);
                return;
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
    async deleteSessionsById(req: Request, res: Response) {
        try {
            const findSession = await this.sessionsService.findUserByDeviceId(req.params.id);
            if (!findSession) {
                res.sendStatus(404);
                return;
            } else {
                if (req.user._id.toString() !== findSession.user_id) {
                    res.sendStatus(403);
                    return;
                }
            }

            const deleteDevice = await this.sessionsService.deleteSessionById(req.params.id);
            if (deleteDevice) {
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
                return;
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
    async getAllSessions(req: Request, res: Response<DeviceViewModel[]>) {
        try {
            const sessions = await this.sessionsQueryRepository.findSessions(req.user._id);
            if (sessions) {
                res.status(200).json(sessions);
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
}