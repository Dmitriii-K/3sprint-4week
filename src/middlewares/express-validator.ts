import { Response, Request, NextFunction } from "express";
import { BlogModel } from "../db/schema-model-db";
import { ObjectId } from "mongodb";
import { body, validationResult } from "express-validator";

const urlPattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
const imailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const loginPattern = /^[a-zA-Z0-9_-]*$/;
const passwordRecoveryPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const enumValues = ['None', 'Like', 'Dislike'];

export const registrationEmail = [
    body("email")
    .isString()
    .withMessage("not string")
    .trim()
    .not()
    .isEmpty()
    .matches(passwordRecoveryPattern)
    .isEmail()
    .withMessage("Invalid email format")
];

export const emailForPasswordRecoveryValidation = [
    body("email")
    .isString()
    .withMessage("not string")
    .trim()
    .not()
    .isEmpty()
    .matches(imailPattern)
    .isEmail()
    .withMessage("Invalid email format")
];

export const passwordAndCodeForRecoveryValidation = [
    body("newPassword")
    .isString()
    .withMessage("not string")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 6, max: 20 })
    .withMessage("Invalid password"),
    body("recoveryCode")
    .isString()
    .trim()
    .not()
    .isEmpty()
    .withMessage("code is not string"),
];

export const validationCode = [
    body("code")
    .isString()
    .trim()
    .not()
    .isEmpty()
    .withMessage("code is not string"),
];

export const commentsValidation = [
    body("content")
    .isString()
    .trim()
    .not()
    .isEmpty()
    .isLength({min: 20, max: 300 })
    .withMessage("content has incorrect values"),
];

export const likeStatusValidation = [
    body("likeStatus")
    .isString()
    .trim()
    .isIn(enumValues)
    .withMessage("Invalid value")
];

export const authCheckValidation = [
    body("loginOrEmail")
    .isString()
    .withMessage("not string")
    .trim()
    .not()
    .isEmpty(),
    body("password")
    .isString()
    .withMessage("not string")
    .trim()
    .not()
    .isEmpty(),
];

export const blogInputValidation = [
    body("name")
    .isString()
    .trim()
    .not()
    .isEmpty()
    .isLength({ max: 15 })
    .withMessage("Имя слишком длинное"),
    body("description")
    .isString()
    .withMessage("не строка")
    .trim()
    .not()
    .isEmpty()
    .isLength({ max: 500 })
    .withMessage("Описание превышает максимальное кол-во символов"),
    body("websiteUrl")
    .isString()
    .withMessage("не строка")
    .trim()
    .matches(urlPattern)
    .withMessage("not url")
    .isLength({ min: 1, max: 100 })
    .withMessage("более 100 символов"),
];

export const blogPostValidation = [
    body("title")
    .isString()
    .trim()
    .not()
    .isEmpty()
    .isLength({ max: 30 })
    .withMessage("Заголовок слишком длинный"),
    body("shortDescription")
    .isString()
    .trim()
    .not()
    .isEmpty()
    .isLength({ max: 100 })
    .withMessage("Описание превышает максимальное кол-во символов"),
    body("content")
    .isString()
    .trim()
    .not()
    .isEmpty()
    .isLength({ max: 1000 })
    .withMessage("Содержание превышает максимальное кол-во символов"),
];

  // export const paginationWithSortingPost = [
  //   query("pageNumber").isInt(),
  //   query("pageSize").isInt(),
  //   query("sortBy").isString(),
  //   query("sortDirection").isString(),
  // ];
  // export const paginationWithSortingBlog = [
  //   paginationWithSortingPost,
  //   query("searchNameTerm").isString(),
  // ];

export const postInputValidation = [
    body("title")
    .isString()
    .trim()
    .not()
    .isEmpty()
    .isLength({ max: 30 })
    .withMessage("Заголовок слишком длинный"),
    body("shortDescription")
    .isString()
    .trim()
    .not()
    .isEmpty()
    .isLength({ max: 100 })
    .withMessage("Описание превышает максимальное кол-во символов"),
    body("content")
    .isString()
    .trim()
    .not()
    .isEmpty()
    .isLength({ max: 1000 })
    .withMessage("Содержание превышает максимальное кол-во символов"),
    body("blogId")
    .isString()
    .custom(async (id) => {
        const ObtId = new ObjectId(id);
        const blog = await BlogModel.findOne({ _id: ObtId });
        if (!blog) {
        throw new Error("no blog!");
        }
        // return true;
    })
    .withMessage(""),
];

export const userInputValidation = [
    body("login")
    .isString()
    .withMessage("not string")
    .trim()
    .not()
    .isEmpty()
    .matches(loginPattern)
    .withMessage("not login")
    .isLength({ min: 3, max: 10 })
    .withMessage("Invalid login"),
      // .custom(async (value) => {
      //   const user = await userCollection.findOne({ login: value });
      //   if (user) {
      //     return Promise.reject("Login is already in use");
      //   }
      // }),
    body("password")
    .isString()
    .withMessage("not string")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 6, max: 20 })
    .withMessage("Invalid password"),
    body("email")
    .isString()
    .withMessage("not string")
    .trim()
    .not()
    .isEmpty()
    .matches(imailPattern)
    .isEmail()
    .withMessage("Invalid email format")
      // .custom(async (value) => {
      //   const user = await userCollection.findOne({ email: value });
      //   if (user) {
      //     return Promise.reject("Email is already in use");
      //   }
      // }),
];

export const userRegistrationValidation = [
    body("login")
    .isString()
    .withMessage("not string")
    .trim()
    .not()
    .isEmpty()
    .matches(loginPattern)
    .withMessage("not login")
    .isLength({ min: 3, max: 10 })
    .withMessage("Invalid login"),
      // .custom(async (value : string) => {
      //   const user = await userCollection.findOne({ login: value });
      //   if (user) {
      //     return Promise.reject("Login is already in use");
      //   }
      // }),
    body("password")
    .isString()
    .withMessage("not string")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 6, max: 20 })
    .withMessage("Invalid password"),
    body("email")
    .isString()
    .withMessage("not string")
    .trim()
    .not()
    .isEmpty()
    .matches(imailPattern)
    .isEmail()
    .withMessage("Invalid email format")
      // .custom(async (value) => {
      //   const user = await userCollection.findOne({ email: value });
      //   if (user) {
      //     return Promise.reject("Email is already in use");
      //   }
      // }),
];

export const inputCheckErrorsMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const e = validationResult(req);
    const errors = e.array({ onlyFirstError: true }) as {
    path: string;
    msg: string;
    }[];
    if (errors.length) {
    res.status(400).json({
        errorsMessages: errors.map((error) => {
        return { message: error.msg, field: error.path };
        }),
    });
    return;
    }
    next();
};