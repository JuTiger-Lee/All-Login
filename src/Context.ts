import { PrismaClient } from "@prisma/client";
import { Container } from "typedi";
import UserRepo from "@/repos/UserRepo";
import UserServices from "@/services/UserServices";
import { MakeErrorResponse, MakeSuccessResponse } from "./utils/make-response";

export default class Context {
  constructor() {
    // Response
    Container.set("MakeSuccessResponse", new MakeSuccessResponse());
    Container.set("MakeErrorResponse", new MakeErrorResponse());

    // Repositories
    Container.set("UserRepo", new UserRepo(new PrismaClient()));

    // Services
    Container.set("UserServices", new UserServices());
  }
}
