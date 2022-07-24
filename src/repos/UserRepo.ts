import { PrismaClient } from "@prisma/client";
import UserRepoable from "@/repos/interfaces/UserRepoable";
import { Service } from "typedi";

@Service()
export default class UserRepo implements UserRepoable {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  async createUser({ email, password }: { email: string; password: string }) {
    await this.prisma.user.create({
      data: {
        email,
        password,
      },
    });
  }
}
