import { user } from "@prisma/client";

export default interface UserServicesable {
  getUser(email: string): Promise<user>;
  checkEmail(email: string): Promise<void>;
  saveUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void>;
}
