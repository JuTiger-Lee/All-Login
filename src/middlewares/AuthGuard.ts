import Context from "@/Context";
import HashHanlder from "@/handler/HashHandler";
import { ErrorResponseable } from "@/utils/make-response";
import express from "express";
import passport from "passport";
import Container from "typedi";

export default class AuthGuard {
  private readonly makeErrorResponse: ErrorResponseable;

  constructor() {
    this.makeErrorResponse = Container.get(Context.MAKE_ERROR_RESPONSE);
  }

  checkAuth(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    passport.authenticate("jwt", { session: false }, (error, user, info) => {
      try {
        if (error) {
          this.makeErrorResponse.init(500, "Authentication Error");
          this.makeErrorResponse.setResponse({
            err: error,
            httpStatus: 500,
            name: "Authentication error",
          });

          throw this.makeErrorResponse.getResponse();
        }

        if (!user) {
          this.makeErrorResponse.init(500, info.name);
          this.makeErrorResponse.setResponse({
            err: {},
            httpStatus: 500,
            name: "Auth No User",
          });

          throw this.makeErrorResponse.getResponse();
        }

        const hashHanlder = new HashHanlder();
        req.user = hashHanlder.getDecodeToken(req.headers.authorization);

        return next();
      } catch (err) {
        return next(err);
      }
    })(req, res, next);
  }
}
