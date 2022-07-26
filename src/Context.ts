import { PrismaClient } from "@prisma/client";
import { Container } from "typedi";
import UserRepo from "@/repos/UserRepo";
import UserServices from "@/services/UserServices";
import { MakeErrorResponse, MakeSuccessResponse } from "./utils/make-response";

export default class Context {
  static readonly MAKE_SUCCESS_RESPONSE = "MakeSuccessResponse";
  static readonly MAKE_ERROR_RESPONSE = "MakeErrorResponse";

  static readonly USER_REPO = "UserRepo";
  static readonly USER_SERVICES = "UserServices";

  constructor() {
    // Response
    Container.set(Context.MAKE_SUCCESS_RESPONSE, new MakeSuccessResponse());
    Container.set(Context.MAKE_ERROR_RESPONSE, new MakeErrorResponse());

    // Repositories
    Container.set(Context.USER_REPO, new UserRepo(new PrismaClient()));

    // Services
    Container.set(Context.USER_SERVICES, new UserServices());
  }
}
