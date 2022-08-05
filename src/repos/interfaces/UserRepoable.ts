import { user } from "@prisma/client";
import { LOGINT_TYPE } from "@/utils/util";

export default interface UserRepoable {
  findEmail(email: string, loginType: LOGINT_TYPE): Promise<user>;
  findName(name: string): Promise<user>;
  createUser({
    email,
    name,
    password,
    loginType,
  }: {
    email: string;
    name: string;
    password: string;
    loginType: LOGINT_TYPE;
  }): Promise<void>;
}
