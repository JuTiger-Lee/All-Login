import { user } from "@prisma/client";

export default interface UserRepoable {
  findEmail(email: string): Promise<user>;
  createUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void>;
}
