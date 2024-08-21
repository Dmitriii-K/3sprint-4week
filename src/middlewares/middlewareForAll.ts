import { Response, Request, NextFunction } from "express";
import { SETTINGS } from "../settings";
// import { apiCollection, blogCollection, sessionsCollection, userCollection } from "../db/mongo-db";
import { SortDirection } from "../input-output-types/eny-type";
import { AuthRepository } from "../auth/authRepository";
import { SessionsRepository } from "../security-devices/sessionsRepository";
import { UserRepository } from "../users/userRepository";
import { JwtService } from "../adapters/jwtToken";
import { authContainer } from "../auth/composition-root";
import { sessionContainer } from "../security-devices/composition-root";
import { userContainer } from "../users/composition-root";


export const authMiddleware = (
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers["authorization"] as string;
  // console.log(auth);
  if (!auth) {
    res.status(401).json({});
    return;
  }
  // const buff = Buffer.from(auth.slice(6), "base64");
  // const decodedAuth = buff.toString("utf8");

  const buff2 = Buffer.from(SETTINGS.ADMIN, "utf8");
  const codedAuth = buff2.toString("base64");

  // if (decodedAuth === ADMIN_AUTH || auth.slice(0, 5) !== "Basic ") {
  //   res.status(401).json({});
  //   return;
  // }
  if (auth.slice(6) !== codedAuth || auth.slice(0, 6) !== "Basic ") {
    res.status(401).json({});
    return;
  }

  next();
};
const buff2 = Buffer.from(SETTINGS.ADMIN, "utf8");
export const codedAuth = buff2.toString("base64");

export const bearerAuth = async (req: Request, res: Response, next: NextFunction) => {
  const userRepository = userContainer.resolve(UserRepository)
  const jwtService = new JwtService();

  if(!req.headers.authorization) {
    res.status(401).json({});
    return;
  }
  const token = req.headers.authorization.split(" ")[1];
  const payload = jwtService.getUserIdByToken(token);
  if(!payload) return res.sendStatus(401);

  // const user : WithId<UserDBModel> | null= await userCollection.findOne({ _id : new ObjectId(payload.userId)}); 
  const user = await userRepository.findUserByMiddleware(payload.userId)
  if(user) {
    req.user = user;
    next();
    return
  } else {
    return res.status(401).json({});
  }
};

export const softBearerAuth = async (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
  const userRepository = userContainer.resolve(UserRepository)
  const jwtService = new JwtService();

  if(!req.headers.authorization) { 
      return next();
    }
    const token = req.headers.authorization.split(" ")[1];
    const payload = jwtService.getUserIdByToken(token);
    if(!payload) return next();
  
    const user = await userRepository.findUserByMiddleware(payload.userId)
    if(user) {
      req.user = user;
      next();
      return
    } else {
      return next();
    }
};

export const checkRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const sessionsRepository = sessionContainer.resolve(SessionsRepository)
  const userRepository = userContainer.resolve(UserRepository)
  const jwtService = new JwtService();

    if(!req.cookies.refreshToken) {
      res.sendStatus(401);
      return
    }
  const token = req.cookies.refreshToken;
  const payload = jwtService.getUserIdByToken(token);
  if(!payload) return res.sendStatus(401);
  
  // const user : WithId<UserDBModel> | null= await userCollection.findOne({ _id : new ObjectId(payload.userId)});
  const user = await userRepository.findUserByMiddleware(payload.userId)
  if(user) {
    req.user = user;
    req.deviceId = payload.deviceId;
    const dateIat = new Date(payload.iat * 1000).toISOString();
    //нужна проверка на соответствие iat действующего токена и сессии в базе данных ? отправляем req.cookies.refreshToken и req.deviceId
    // const session = await sessionsCollection.findOne({device_id: req.deviceId})
    const session = await sessionsRepository.findSessionByMiddleware(req.deviceId)
    if(session?.iat !== dateIat) {
      res.sendStatus(401)
      return
    }
    next();
    return
  } else {
    return res.status(401).json({});
  }
};

export const halper = (query: {
  [key: string]: string | number | undefined;
}): any => {
  return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize ? +query.pageSize : 10,
    sortBy: query.sortBy ? query.sortBy : "createdAt",
    sortDirection: query.sortDirection
      ? (query.sortDirection as SortDirection)
      : "desc",
    searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
  };
};

export const userPagination = (query: {
  [key: string]: string | number | undefined;
}): any => {
  return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize ? +query.pageSize : 10,
    sortBy: query.sortBy ? query.sortBy : "createdAt",
    sortDirection: query.sortDirection
      ? (query.sortDirection as SortDirection)
      : "desc",
    searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
    searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null,
  };
};

export const commentsPagination = (query: {
  [key: string]: string | number | undefined;
}): any => {
  return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize ? +query.pageSize : 10,
    sortBy: query.sortBy ? query.sortBy : "createdAt",
    sortDirection: query.sortDirection
      ? (query.sortDirection as SortDirection)
      : "desc",
  };
};

export const countDocumentApi = async (req: Request, res: Response, next: NextFunction) => {
  const authRepository = authContainer.resolve(AuthRepository)

  const currentDate = new Date();
  const tenSecondsAgo = new Date(Date.now() - 10000);
  const ip = req.ip;
  const url = req.originalUrl;

  // const filterDocument = {
  //   ip: ip,
  //   URL: url,
  //   date: { $gte: tenSecondsAgo }
  // }
  // await apiCollection.insertOne({ip: ip, URL: url, date: currentDate});
  // const requestCount = await apiCollection.countDocuments(filterDocument);
  const result = await authRepository.dataRecording(ip!, url, currentDate)
  const requestCount = await authRepository.countingNumberRequests(ip!, url, tenSecondsAgo)
  if(requestCount > 5) {
    res.sendStatus(429)
  } else {
    next();
  }
};