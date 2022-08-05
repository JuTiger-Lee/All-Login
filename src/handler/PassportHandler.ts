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
import { PRODUCTION_MODE } from "@/utils/util";

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
      if (env.get("NODE_ENV").asString() !== PRODUCTION_MODE) {
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
        const user = await userService.getUser(
          payload.email,
          payload.loginType
        );

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
        const user = await userService.getUser(email, "LOCAL");

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
          clientSecret: "",
          callbackURL: "http://localhost:8080/api/user/kakao/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const hashHandler = new HashHanlder();
            const loginType = "KAKAO";
            const kakaoEmail =
              profile._json && profile._json.kakao_account.email;
            const kakaoUser = await userService.getUser(kakaoEmail, loginType);

            const doneData = {
              accessToken,
              refreshToken,
            };

            if (kakaoUser) {
              return done(null, { ...doneData, kakaoUser: kakaoUser });
            }

            const kakaoNewUser = await userService.saveUser({
              loginType,
              email: kakaoEmail,
              name: profile.displayName,
              password: hashHandler.getHash(hashHandler.getRandomSuffix(5)),
            });

            return done(null, {
              ...doneData,
              kakaoUser: kakaoNewUser,
            });
          } catch (err) {
            return done(err);
          }
        }
      )
    );
  }
}
