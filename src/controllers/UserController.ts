import express from "express";
import UserServicesable from "@/services/interfaces/UserServicesable";
import { SuccessResponseable } from "@/utils/make-response";
import { Inject } from "typedi";

export default class UserController {
  constructor(
    @Inject("UserServices") private readonly userServices: UserServicesable,
    @Inject("MakeSuccessResponse")
    private readonly makeSuccessResponse: SuccessResponseable
  ) {
    this.userServices = userServices;
  }

  signUp(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { email, password } = req.body;

    try {
      this.makeSuccessResponse.init(200, "Sign Up Success");
      this.makeSuccessResponse.setResponse([]);

      return res.json(this.makeSuccessResponse.getResponse());
    } catch (err) {
      next(err);
    }
  }

  signIn(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {}
}
