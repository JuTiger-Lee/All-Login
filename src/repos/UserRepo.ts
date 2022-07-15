import { PrismaClient } from "@prisma/client";
import { Inject, Service } from "typedi";

@Service()
export default class UserRepo {
  constructor(@Inject("Prisma") private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }
}
