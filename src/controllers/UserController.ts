import express from "express";
import jwt from "jsonwebtoken";
import env from "env-var";
import UserServicesable from "@/services/interfaces/UserServicesable";
import { SuccessResponseable } from "@/utils/make-response";
import Container from "typedi";
import HashHanlder from "@/handler/HashHandler";
import Context from "@/Context";
import passport from "passport";

export default class UserController extends Context {
  private readonly userServices: UserServicesable;
  private readonly makeSuccessResponse: SuccessResponseable;

  constructor() {
    super();
    this.userServices = Container.get("UserServices");
    this.makeSuccessResponse = Container.get("MakeSuccessResponse");
  }

  async signUp(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { email, password }: { email: string; password: string } = req.body;

      await this.userServices.checkEmail(email);

      const hashHanlder = new HashHanlder();
      const hashPassword = hashHanlder.getHash(password);

      this.userServices.saveUser({
        email,
        password: hashPassword,
      });

      this.makeSuccessResponse.init(200, "Sign Up Success");
      this.makeSuccessResponse.setResponse([]);

      return res.status(201).json(this.makeSuccessResponse.getResponse());
    } catch (err) {
      return next(err);
    }
  }

  signIn(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      passport.authenticate("local", (passportError, user, info) => {
        if (passportError) {
          console.log("::PassportError", passportError);
          // Todo Error
        }

        if (info) {
          console.log("::info", info.message);
          if (info.message === "Non Existent User") {
            // Todo Error ::존재하지 않는 사용자
          } else if (info.message === "Wrong Password") {
            // Todo Error :: 비밀번호 불일치
          }
        }

        req.login(user, { session: false }, (loginError) => {
          if (loginError) {
            console.log("::loginError", loginError);
            // Todo Error
          }

          const token = jwt.sign(
            {
              email: user.email,
            },
            env.get("AUTH_KEY").asString(),
            {
              expiresIn: "3600m",
            }
          );

          this.makeSuccessResponse.init(200, "Sign In Success");
          this.makeSuccessResponse.setResponse([{ token }]);
        });
      })(req, res);

      return res.status(200).json(this.makeSuccessResponse.getResponse());
    } catch (err) {
      return next(err);
    }
  }

  testAuth(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.status(200).send("Auth Success");
  }
}
