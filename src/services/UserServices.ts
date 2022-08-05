import Context from "@/Context";
import UserRepoable from "@/repos/interfaces/UserRepoable";
import UserServicesable from "@/services/interfaces/UserServicesable";
import { ErrorResponseable } from "@/utils/make-response";
import Container, { Service } from "typedi";

@Service()
export default class UserServices implements UserServicesable {
  private readonly userRepo: UserRepoable;
  private readonly makeErrorResponse: ErrorResponseable;

  constructor() {
    this.userRepo = Container.get(Context.USER_REPO);
    this.makeErrorResponse = Container.get(Context.MAKE_ERROR_RESPONSE);
  }

  async getUser(
    email: string,
    loginType: "GOOGLE" | "KAKAO" | "FACEBOOK" | "LOCAL"
  ) {
    return await this.userRepo.findEmail(email, loginType);
  }

  async checkEmail(
    email: string,
    loginType: "GOOGLE" | "KAKAO" | "FACEBOOK" | "LOCAL"
  ) {
    const user = await this.userRepo.findEmail(email, loginType);

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

  async checkName(name: string) {
    const user = await this.userRepo.findName(name);

    if (user) {
      this.makeErrorResponse.init(400, "The same name already exists.");
      this.makeErrorResponse.setResponse({
        err: {},
        httpStatus: 400,
        name: "",
      });
      throw this.makeErrorResponse.getResponse();
    }
  }

  async saveUser({
    email,
    name,
    password,
    loginType,
  }: {
    email: string;
    name: string;
    password: string;
    loginType: "GOOGLE" | "KAKAO" | "FACEBOOK" | "LOCAL";
  }) {
    await this.userRepo.createUser({ email, name, password, loginType });
  }
}
