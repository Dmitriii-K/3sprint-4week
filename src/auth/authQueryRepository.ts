import { ObjectId, WithId } from "mongodb";
import { MeViewModel } from "../input-output-types/auth-type";
import { UserDBModel } from "../input-output-types/users-type";
import { UserModel } from "../db/schema-model-db";

export class AuthMe {
    static async getAuth(data: WithId<UserDBModel>): Promise<MeViewModel | null> {
        const userMe = await UserModel.findOne({ _id: new ObjectId(data._id) });
        console.log(userMe);
        if (!userMe) {
            return null;
        }
        return { email: userMe!.email, login: userMe!.login, userId: userMe!._id.toString() };
    }
}