import { PrismaClient } from "@prisma/client";
import { Service } from "typedi";

@Service()
export default class Prisma {
  public readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
}
