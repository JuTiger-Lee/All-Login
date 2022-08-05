import { user } from "@prisma/client";
import { LOGINT_TYPE } from "@/utils/util";

export default interface UserServicesable {
  getUser(email: string, loginType: LOGINT_TYPE): Promise<user>;
  checkEmail(email: string, loginType: LOGINT_TYPE): Promise<void>;
  checkName(name: string): Promise<void>;
  saveUser({
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
