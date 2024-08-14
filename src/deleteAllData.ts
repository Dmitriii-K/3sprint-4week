import { Request, Response } from "express";
import { Router } from "express";
// import { blogCollection, postCollection, userCollection, commentCollection, tokenCollection,
// apiCollection, sessionsCollection} from "./db/mongo-db";
import { ApiModel, BlogModel, CommentModel, LikesModel, PostModel, SessionModel, UserModel } from "./db/schema-model-db";

export const deleteRouter = Router();

deleteRouter.delete("/all-data", async (req: Request, res: Response) => {
  await BlogModel.deleteMany({});
  await PostModel.deleteMany({});
  await CommentModel.deleteMany({});
  await UserModel.deleteMany({});
  await ApiModel.deleteMany({});
  await SessionModel.deleteMany({});
  await LikesModel.deleteMany({});

  // await postCollection.drop();
  // await blogCollection.drop();
  // await userCollection.drop();
  // await commentCollection.drop();
  // await apiCollection.drop();
  // await sessionsCollection.drop();
  
  // await tokenCollection.drop();
  res.sendStatus(204);
  console.log("All data is deleted");
});
