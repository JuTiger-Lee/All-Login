import { PrismaClient } from "@prisma/client";
import { Inject, Service } from "typedi";
import UserRepoable from "@/repos/interfaces/UserRepoable";

@Service()
export default class UserRepo implements UserRepoable {
  constructor(@Inject("Prisma") private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }
}
