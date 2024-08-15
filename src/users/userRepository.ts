// import { userCollection } from "../db/mongo-db";
import { UserModel } from "../db/schema-model-db";
import { UserDBModel } from "../input-output-types/users-type";
import { ObjectId } from "mongodb";

export class UserRepository {
    async insertUser(user: UserDBModel) {
        const saveResult = await UserModel.create(user);
        return saveResult._id.toString();
    }

    async findUserById(id: string) {
        const mongoId = new ObjectId(id);
        const user = await UserModel.findOne({ _id: mongoId });
        if (!user) {
            return null;
        }
        return user;
    }
    async findUserByMiddleware (id: string) {
        const mongoId = new ObjectId(id);
        const user = await UserModel.findOne({_id: mongoId});
        if (!user) {
            return null;
        }
        return user
    }
    async findUserByLogiOrEmail(data: { login: string, email: string }) {
        return UserModel.findOne({ $or: [{ login: data.login }, { email: data.email }] });
    }

    async deleteUser(id: string) {
        const mongoId = new ObjectId(id);
        const user = await UserModel.deleteOne({ _id: mongoId });
        if (user.deletedCount === 1) {
            return true;
        }
        return false;
    }
}