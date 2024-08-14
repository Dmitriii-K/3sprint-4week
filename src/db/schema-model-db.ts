import mongoose from 'mongoose'
import { BlogDbType } from '../input-output-types/blogs-type'
import { ExtendedLikesInfoType, NewestLikesType, PostDbType } from '../input-output-types/posts-type'
import { CommentatorInfo, CommentDBType, LikesCount, likeStatus, LikesType } from '../input-output-types/comments-type'
import { EmailConfirmationType, UserDBModel } from '../input-output-types/users-type'
import { ApiInfoType } from '../input-output-types/eny-type'
import { SessionsType } from '../input-output-types/sessions-types'

export const BlogSchema = new mongoose.Schema<BlogDbType>({
    name: { type: String, require: true },
    description: { type: String, require: true },
    websiteUrl: { type: String, require: true },
    createdAt: { type: String, require: true },
    isMembership: { type: Boolean, require: true }
})
export const BlogModel = mongoose.model<BlogDbType>('blogs', BlogSchema)

const newestLikesSchema = new mongoose.Schema<NewestLikesType>({
    addedAt: { type: String, require: true },
    userId: { type: String, require: true },
    login: { type: String, require: true }
}, { _id: false })
const extendedLikesInfoSchema = new mongoose.Schema<ExtendedLikesInfoType>({
    likesCount: { type: Number, require: true },
    dislikesCount: { type: Number, require: true },
    newestLikes:{type: [newestLikesSchema], require: true}
}, { _id: false })
export const PostSchema = new mongoose.Schema<PostDbType>({
    title: { type: String, require: true },
    shortDescription: { type: String, require: true },
    content: { type: String, require: true },
    blogId: { type: String, require: true },
    blogName: { type: String, require: true },
    createdAt: { type: String, require: true },
    extendedLikesInfo: { type: extendedLikesInfoSchema, require: true }
})
export const PostModel = mongoose.model<PostDbType>('posts', PostSchema)

const commentatorInfoSchema = new mongoose.Schema<CommentatorInfo>({
    userId: { type: String, require: true },
    userLogin: { type: String, require: true }
}, { _id: false });
const likesCountSchema = new mongoose.Schema<LikesCount>({
    likesCount: { type: Number, require: true },
    dislikesCount: { type: Number, require: true }
}, { _id: false });
export const CommentSchema = new mongoose.Schema<CommentDBType>({
    postId: { type: String, require: true },
    content: { type: String, require: true },
    createdAt: { type: String, require: true },
    commentatorInfo: { type: commentatorInfoSchema, require: true },
    likesInfo: { type: likesCountSchema, require: true },
})
export const CommentModel = mongoose.model<CommentDBType>('comments', CommentSchema)

export const LikesSchema = new mongoose.Schema<LikesType>({
    addedAt: {type: String, require: true},
    commentId: {type: String, require: true},
    userId: {type: String, require: true},
    userIogin: {type: String, require: true},
    status: { type: String, enum: Object.values(likeStatus), require: true, default: likeStatus.None }
})
export const LikesModel = mongoose.model<LikesType>('likes', LikesSchema)

const emailConfirmationSchema = new mongoose.Schema<EmailConfirmationType>({
    confirmationCode: {type: String, require: false},
    expirationDate: {type: String, require: false},
    isConfirmed: {type: Boolean, require: true}
}, { _id: false });
export const UserSchema = new mongoose.Schema<UserDBModel>({
    login: { type: String, require: true },
    password: { type: String, require: true },
    email: { type: String, require: true },
    createdAt: { type: String, require: true },
    emailConfirmation: { type: emailConfirmationSchema, require: true }
})
export const UserModel = mongoose.model<UserDBModel>('users', UserSchema)

export const ApiSchema = new mongoose.Schema<ApiInfoType>({
    ip: { type: String, require: true },
    URL: { type: String, require: true }, 
    date: { type: Date, require: true }, 
})
export const ApiModel = mongoose.model<ApiInfoType>('api-info', ApiSchema)

export const SessionSchema = new mongoose.Schema<SessionsType>({
    user_id: { type: String, require: true },
    device_id: { type: String, require: true },
    iat: { type: String, require: true },
    exp: { type: String, require: true },
    device_name: { type: String, require: true },
    ip: { type: String, require: true }
})
export const SessionModel = mongoose.model<SessionsType>('sessions', SessionSchema)