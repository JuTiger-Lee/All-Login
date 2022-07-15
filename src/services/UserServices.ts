import UserRepoable from "@/repos/interfaces/UserRepoable";
import { Inject } from "typedi";
import UserServicesable from "@/services/interfaces/UserServicesable";

export default class UserServices implements UserServicesable {
  constructor(@Inject("UserRepo") private readonly userRepo: UserRepoable) {
    this.userRepo = userRepo;
  }
}
