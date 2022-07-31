import passport from "passport";
import passportJWT from "passport-jwt";
import passportLocal from "passport-local";
// passportKakao.Strategy 접근시 not a constructor error 발생
import * as passportKakao from "passport-kakao";
import env from "env-var";
import Container from "typedi";
import UserServicesable from "@/services/interfaces/UserServicesable";
import HashHanlder from "@/handler/HashHandler";
import Context from "@/Context";

interface VerifyPassport<T> {
  Strategy: T;
  passportName: string;
  verify(userService: UserServicesable): void;
}

export default class PassportHandler {
  private userService: UserServicesable;
  private static passportType =
    passportJWT.Strategy || passportLocal.Strategy || passportKakao.Strategy;
  private verifys: Array<VerifyPassport<typeof PassportHandler.passportType>>;

  constructor() {
    this.userService = Container.get(Context.USER_SERVICES);
    this.verifys = [new Jwt(), new Local(), new Kakao()];
  }

  init() {
    for (let verifyIdx = 0; verifyIdx < this.verifys.length; verifyIdx += 1) {
      if (env.get("NODE_ENV").asString() !== "production") {
        console.log(
          "::Passport Collection",
          this.verifys[verifyIdx].constructor.name.toUpperCase()
        );
      }

      this.verifys[verifyIdx].verify(this.userService);
    }
  }
}

class Jwt implements VerifyPassport<typeof passportJWT.Strategy> {
  Strategy: typeof passportJWT.Strategy;
  passportName: string;

  constructor() {
    this.Strategy = passportJWT.Strategy;
    this.passportName = Jwt.prototype.constructor.name.toLowerCase();
  }

  verify(userService: UserServicesable): void {
    const jwtOption = {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.get("AUTH_KEY").asString(),
      ignoreExpiration: false,
      passReqToCallback: false,
    };

    passport.use(
      this.passportName,
      new this.Strategy(jwtOption, async (payload, done) => {
        const user = await userService.getUser(payload.email);

        if (!user) {
          return done(null, false, { message: "Unauthorized" });
        }

        return done(null, user);
      })
    );
  }
}

class Local implements VerifyPassport<typeof passportLocal.Strategy> {
  Strategy: typeof passportLocal.Strategy;
  passportName: string;

  constructor() {
    this.Strategy = passportLocal.Strategy;
    this.passportName = Local.prototype.constructor.name.toLowerCase();
  }

  verify(userService: UserServicesable): void {
    const passportOption = {
      usernameField: "email",
      passwordField: "password",
    };

    passport.use(
      this.passportName,
      new this.Strategy(passportOption, async (email, password, done) => {
        const user = await userService.getUser(email);

        if (!user) {
          return done(null, false, { message: "Non Existent User" });
        }

        const hashHandler = new HashHanlder();

        if (hashHandler.compare(user.password, password)) {
          return done(null, false, { message: "Wrong Password" });
        }

        return done(null, user);
      })
    );
  }
}

class Kakao implements VerifyPassport<typeof passportKakao.Strategy> {
  Strategy: typeof passportKakao.Strategy;
  passportName: string;

  constructor() {
    this.Strategy = passportKakao.Strategy;
    this.passportName = Kakao.prototype.constructor.name.toLowerCase();
  }

  verify(userService: UserServicesable): void {
    passport.use(
      this.passportName,
      new this.Strategy(
        {
          clientID: env.get("KAKAO_CLIENT_ID").asString(),
          callbackURL: "http://localhost:8080/api/user/kakao/callback",
        },
        (accessToken, refreshToken, profile, done) => {
          console.log("accessToken", accessToken);
          console.log("refreshToken", refreshToken);
          console.log("profile", profile);
          done(null, {});
        }
      )
    );
  }
}

// class Facebook implements VerifyPassport {
//   verify(userService: UserServicesable): void {}
// }

// class Google implements VerifyPassport {
//   verify(userService: UserServicesable): void {}
// }
