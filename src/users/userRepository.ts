// import { userCollection } from "../db/mongo-db";
import { UserModel } from "../db/schema-model-db";
import { UserDBModel } from "../input-output-types/users-type";
import { ObjectId } from "mongodb";

export class UserRepository {
    static async insertUser (user: UserDBModel) {
        const saveResult = await UserModel.create(user);
        return saveResult._id.toString();
    }
    static async findUserById (id: string) {
        const mongoId = new ObjectId(id);
        const user = await UserModel.findOne({_id: mongoId});
        if (!user) {
            return null;
        };
        return user
    }
    static async findUserByLogiOrEmail (data: {login: string, email:string}) {
        return UserModel.findOne({ $or: [{ login: data.login }, { email: data.email }] });
    }
    static async deleteUser (id: string) {
        const mongoId = new ObjectId(id);
        const user = await UserModel.deleteOne({_id: mongoId});
        if (user.deletedCount === 1) {
            return true;
        };
        return false;
    }
}