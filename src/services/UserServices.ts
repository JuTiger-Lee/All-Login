import UserRepoable from "@/repos/interfaces/UserRepoable";
import UserServicesable from "@/services/interfaces/UserServicesable";
import { MakeErrorResponse } from "@/utils/make-response";
import { Inject } from "typedi";

export default class UserServices implements UserServicesable {
  constructor(
    @Inject("UserRepo") private readonly userRepo: UserRepoable,
    @Inject("MakeErrorResponse")
    private readonly makeErrorResponse: MakeErrorResponse
  ) {
    this.userRepo = userRepo;
  }
}
