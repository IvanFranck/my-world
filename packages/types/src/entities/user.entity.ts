import { User as BetterAuthUser } from "better-auth";

export type IUser = BetterAuthUser;

export type IPublicUser = Pick<IUser, "id" | "email" | "name" | "image">;
