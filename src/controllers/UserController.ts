import express from "express";
import {
  UserLocal,
  UserKakao,
  UserFacebook,
  UserGoogle,
  UserNaver
} from "@/controllers/user.sign.controller";
import BaseController from "@/controllers/BaseController";

export default class UserController extends BaseController {
  userLocal: UserLocal;
  userKakao: UserKakao;
  userFacebook: UserFacebook;
  userGoogle: UserGoogle;
  userNaver: UserNaver;

  constructor() {
    super();
    this.userLocal = new UserLocal();
    this.userKakao = new UserKakao();
    this.userFacebook = new UserFacebook();
    this.userGoogle = new UserGoogle();
    this.userNaver = new UserNaver();
  }

  testAuth(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.status(200).send("Auth Success");
  }
}
