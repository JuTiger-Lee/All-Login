import { user } from "@prisma/client";

export default interface UserRepoable {
  findEmail(
    email: string,
    loginType: "GOOGLE" | "KAKAO" | "FACEBOOK" | "LOCAL"
  ): Promise<user>;
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
    loginType: "GOOGLE" | "KAKAO" | "FACEBOOK" | "LOCAL";
  }): Promise<void>;
}
