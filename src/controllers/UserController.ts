import UserServicesable from "@/services/interfaces/UserServicesable";
import { Inject } from "typedi";

export default class UserController {
  constructor(
    @Inject("UserServices") private readonly userServices: UserServicesable
  ) {
    this.userServices = userServices;
  }
}
