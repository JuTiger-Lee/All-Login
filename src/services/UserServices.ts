import UserRepoable from "@/repos/interfaces/UserRepoable";
import UserServicesable from "@/services/interfaces/UserServicesable";
import { ErrorResponseable } from "@/utils/make-response";
import Container, { Service } from "typedi";

@Service()
export default class UserServices implements UserServicesable {
  private readonly userRepo: UserRepoable;
  private readonly makeErrorResponse: ErrorResponseable;

  constructor() {
    this.userRepo = Container.get("UserRepo");
    this.makeErrorResponse = Container.get("MakeErrorResponse");
  }

  async getUser(email: string) {
    return await this.userRepo.findEmail(email);
  }

  async checkEmail(email: string) {
    const user = await this.userRepo.findEmail(email);

    if (user) {
      this.makeErrorResponse.init(400, "The same email already exists.");
      this.makeErrorResponse.setResponse({
        err: {},
        httpStatus: 400,
        name: "",
      });
      throw this.makeErrorResponse.getResponse();
    }
  }

  async saveUser({ email, password }: { email: string; password: string }) {
    await this.userRepo.createUser({ email, password });
  }
}
