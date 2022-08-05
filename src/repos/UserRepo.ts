import { PrismaClient } from "@prisma/client";
import UserRepoable from "@/repos/interfaces/UserRepoable";
import { Service } from "typedi";
import { LOGINT_TYPE } from "@/utils/util";

@Service()
export default class UserRepo implements UserRepoable {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findEmail(email: string, loginType: LOGINT_TYPE) {
    return await this.prisma.user.findFirst({
      where: {
        email,
        login_type: loginType,
      },
    });
  }

  async findName(name: string) {
    return await this.prisma.user.findFirst({
      where: {
        name,
      },
    });
  }

  async createUser({
    email,
    name,
    password,
    loginType,
  }: {
    email: string;
    name: string;
    password: string;
    loginType: LOGINT_TYPE;
  }) {
    await this.prisma.user.create({
      data: {
        email,
        name,
        password,
        login_type: loginType,
      },
    });
  }
}
