import UserRepoable from "@/repos/interfaces/UserRepoable";
import { Inject } from "typedi";

export default class UserServices {
  constructor(@Inject("UserRepo") private readonly userRepo: UserRepoable) {
    this.userRepo = userRepo;
  }
}
