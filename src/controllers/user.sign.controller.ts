import express from "express";
import passport from "passport";
import axios from "axios";
import jwt from "jsonwebtoken";
import env from "env-var";
import BaseController from "@/controllers/BaseController";
import HashHanlder from "@/handler/HashHandler";

interface UserSocial {
  signIn(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void>;
  signInCallback(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void>;
  signOut(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void>;
}

function makeToken({
  email,
  loginType,
  accessToken,
  refreshToken,
}: {
  email: string;
  loginType: string;
  accessToken?: string;
  refreshToken?: string;
}) {
  return jwt.sign(
    {
      email,
      loginType,
      accessToken,
      refreshToken,
    },
    env.get("AUTH_KEY").asString(),
    {
      expiresIn: "3600m",
    }
  );
}

export class UserLocal extends BaseController {
  constructor() {
    super();
  }

  async signUp(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const {
        email,
        name,
        password,
      }: { email: string; name: string; password: string } = req.body;

      await this.userServices.checkEmail(email, "LOCAL");
      await this.userServices.checkName(name);

      const hashHanlder = new HashHanlder();
      const hashPassword = hashHanlder.getHash(password);

      this.userServices.saveUser({
        email,
        name,
        password: hashPassword,
        loginType: "LOCAL",
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
          this.makeErrorResponse.init(400, info.message);
          this.makeErrorResponse.setResponse({
            err: {},
            httpStatus: 400,
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
              name: "SingIn Error",
            });

            throw this.makeErrorResponse.getResponse();
          }

          const token = makeToken({
            email: user.verifyedUser.email,
            loginType: "LOCAL",
          });

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

export class UserKakao extends BaseController implements UserSocial {
  constructor() {
    super();
  }

  async signIn(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    passport.authenticate("kakao")(req, res, next);
  }

  async signInCallback(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    passport.authenticate(
      "kakao",
      {
        session: false,
        failureRedirect: "/",
      },
      (err, user) => {
        try {
          if (err) {
            this.makeErrorResponse.init(500, "Authentication Error");
            this.makeErrorResponse.setResponse({
              err,
              httpStatus: 500,
              name: "Kakao Authentication error",
            });

            throw this.makeErrorResponse.getResponse();
          }

          if (!user) {
            this.makeErrorResponse.init(400, "Auth No User");
            this.makeErrorResponse.setResponse({
              err: {},
              httpStatus: 400,
              name: "Kakao Auth No User",
            });

            throw this.makeErrorResponse.getResponse();
          }

          const token = makeToken({
            email: user.verifyedUser.email,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
            loginType: "KAKAO",
          });

          this.makeSuccessResponse.init(200, "SignIn Success");
          this.makeSuccessResponse.setResponse([{ token }]);
          return res.status(200).json(this.makeSuccessResponse.getResponse());
        } catch (err) {
          return next(err);
        }
      }
    )(req, res, next);
  }

  async signOut(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const accessToken = req.user["accessToken"];
      const param = {};
      const headerOption = {
        headers: { Authorization: `Bearer ${accessToken}` },
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

export class UserFacebook extends BaseController implements UserSocial {
  constructor() {
    super();
  }

  async signIn(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    passport.authenticate("facebook", { scope: ["email"] })(req, res, next);
  }

  async signInCallback(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    passport.authenticate(
      "facebook",
      {
        session: false,
        failureRedirect: "/",
      },
      (err, user) => {
        try {
          if (err) {
            this.makeErrorResponse.init(500, "Authentication Error");
            this.makeErrorResponse.setResponse({
              err,
              httpStatus: 500,
              name: "Facebook Authentication error",
            });

            throw this.makeErrorResponse.getResponse();
          }

          if (!user) {
            this.makeErrorResponse.init(500, "Auth No User");
            this.makeErrorResponse.setResponse({
              err: {},
              httpStatus: 500,
              name: "Facebook Auth No User",
            });

            throw this.makeErrorResponse.getResponse();
          }

          const token = makeToken({
            email: user.verifyedUser.email,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
            loginType: "FACEBOOK",
          });

          this.makeSuccessResponse.init(200, "SignIn Success");
          this.makeSuccessResponse.setResponse([{ token }]);
          return res.status(200).json(this.makeSuccessResponse.getResponse());
        } catch (err) {
          return next(err);
        }
      }
    )(req, res, next);
  }

  async signOut(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const accessToken = req.user["accessToken"];

      await axios.get(
        `https://www.facebook.com/logout.php?ref=ds&h=${accessToken}`
      );

      return res.redirect("/");
    } catch (err) {
      return next(err);
    }
  }
}

export class UserGoogle extends BaseController implements UserSocial {
  constructor() {
    super();
  }

  async signIn(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    passport.authenticate("google", { scope: ["email", "profile"] })(
      req,
      res,
      next
    );
  }

  async signInCallback(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    passport.authenticate(
      "google",
      {
        session: false,
        failureRedirect: "/",
      },
      (err, user) => {
        try {
          if (err) {
            this.makeErrorResponse.init(500, "Authentication Error");
            this.makeErrorResponse.setResponse({
              err,
              httpStatus: 500,
              name: "Google Authentication error",
            });

            throw this.makeErrorResponse.getResponse();
          }

          if (!user) {
            this.makeErrorResponse.init(500, "Auth No User");
            this.makeErrorResponse.setResponse({
              err: {},
              httpStatus: 500,
              name: "Google Auth No User",
            });

            throw this.makeErrorResponse.getResponse();
          }

          const token = makeToken({
            email: user.verifyedUser.email,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
            loginType: "GOOGLE",
          });

          this.makeSuccessResponse.init(200, "SignIn Success");
          this.makeSuccessResponse.setResponse([{ token }]);
          return res.status(200).json(this.makeSuccessResponse.getResponse());
        } catch (err) {
          return next(err);
        }
      }
    )(req, res, next);
  }

  async signOut(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const accessToken = req.user["accessToken"];

      await axios.get(
        `https://accounts.google.com/o/oauth2/revoke?token=${accessToken}`
      );

      return res.redirect("/");
    } catch (err) {
      return next(err);
    }
  }
}
