import express from "express";
import jwt from "jsonwebtoken";
import env from "env-var";
import UserServicesable from "@/services/interfaces/UserServicesable";
import { ErrorResponseable, SuccessResponseable } from "@/utils/make-response";
import Container from "typedi";
import HashHanlder from "@/handler/HashHandler";
import Context from "@/Context";
import passport from "passport";
import axios from "axios";

class BaseUserController extends Context {
  protected readonly userServices: UserServicesable;
  protected readonly makeErrorResponse: ErrorResponseable;
  protected readonly makeSuccessResponse: SuccessResponseable;

  constructor() {
    super();
    this.userServices = Container.get(Context.USER_SERVICES);
    this.makeErrorResponse = Container.get(Context.MAKE_ERROR_RESPONSE);
    this.makeSuccessResponse = Container.get(Context.MAKE_SUCCESS_RESPONSE);
  }
}

export default class UserController extends BaseUserController {
  userLocal: UserLocal;
  userKakao: UserKakao;

  constructor() {
    super();
    this.userLocal = new UserLocal();
    this.userKakao = new UserKakao();
  }

  testAuth(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.status(200).send("Auth Success");
  }
}

// Sign Class

class UserLocal extends BaseUserController {
  constructor() {
    super();
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
    passport.authenticate("local", (passportError, user, info) => {
      try {
        if (passportError) {
          this.makeErrorResponse.init(500, "SingIn Error");
          this.makeErrorResponse.setResponse({
            err: passportError,
            httpStatus: 500,
            name: "Passport Error",
          });

          throw this.makeErrorResponse.getResponse();
        }

        if (info) {
          this.makeErrorResponse.init(500, info.message);
          this.makeErrorResponse.setResponse({
            err: {},
            httpStatus: 500,
            name: "Passport Info Error",
          });

          throw this.makeErrorResponse.getResponse();
        }

        req.login(user, { session: false }, (loginError) => {
          if (loginError) {
            this.makeErrorResponse.init(500, "SingIn Error");
            this.makeErrorResponse.setResponse({
              err: loginError,
              httpStatus: 500,
              name: "Login Error",
            });

            throw this.makeErrorResponse.getResponse();
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

          this.makeSuccessResponse.init(200, "SignIn Success");
          this.makeSuccessResponse.setResponse([{ token }]);
          return res.status(200).json(this.makeSuccessResponse.getResponse());
        });
      } catch (err) {
        return next(err);
      }
    })(req, res, next);
  }
}

class UserKakao extends BaseUserController {
  constructor() {
    super();
  }

  async signOut(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const accesssToken = req.query.accesssToken;
      const param = {};
      const headerOption = {
        headers: { Authorization: `Bearer ${accesssToken}` },
      };

      await axios.post(
        "https://kapi.kakao.com/v1/user/unlink",
        param,
        headerOption
      );

      return res.redirect("/");
    } catch (err) {
      return next(err);
    }
  }
}
