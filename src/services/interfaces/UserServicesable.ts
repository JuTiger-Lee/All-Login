import { user } from "@prisma/client";

export default interface UserServicesable {
  getUser(
    email: string,
    loginType: "GOOGLE" | "KAKAO" | "FACEBOOK" | "LOCAL"
  ): Promise<user>;
  checkEmail(
    email: string,
    loginType: "GOOGLE" | "KAKAO" | "FACEBOOK" | "LOCAL"
  ): Promise<void>;
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
    loginType: "GOOGLE" | "KAKAO" | "FACEBOOK" | "LOCAL";
  }): Promise<void>;
}
