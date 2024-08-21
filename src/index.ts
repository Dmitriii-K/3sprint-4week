import 'reflect-metadata';
// import { connectDB } from "./db/mongo-db";
import { runDb } from "./db/mongo-db";
import { SETTINGS } from "./settings";
import { app } from "./app";

// export const start = async () => {
//   if (!(await connectDB())) { // connect mongoose- "runDb"
//     console.log("NOT CONNECT TO DB");
//     process.exit(1);
//   }

//   app.get("/", (req, res) => {
//     res.status(200).json("WORKING");
//   });

//   app.listen(SETTINGS.PORT, () => {
//     console.log("...server started in port " + SETTINGS.PORT);
//   });
// };
// start();

const startApp = async () => {
  await runDb()
  app.listen(SETTINGS.PORT, () => {
      console.log(`Example app listening on port ${SETTINGS.PORT}`)
  })
}
startApp()