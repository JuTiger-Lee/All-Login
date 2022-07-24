import HashHanlder from "@/handler/HashHandler";
import express from "express";
import passport from "passport";

export default class AuthGuard {
  checkAuth(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    passport.authenticate("jwt", { session: false }, (error, user, info) => {
      try {
        if (error) {
          // ::Todo auth error
        }

        if (!user) {
          console.log("::info name", info.name);
          if (info.name === "TokenExpiredError") {
            // ::Todo 토큰 만료
          } else {
            // ::Todo 인증된 사용자 아님
          }
        }

        const hashHanlder = new HashHanlder();

        req.user = hashHanlder.decodeToken(req.headers.authorization);
        console.log("rrr", req.user);

        return next();
      } catch (err) {
        return next(err);
      }
    })(req, res, next);
  }
}
