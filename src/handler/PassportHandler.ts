import passport from "passport";
import passportLocal from "passport-local";
import passportJWT from "passport-jwt";
// passportKakao.Strategy 접근시 not a constructor error 발생
import * as passportKakao from "passport-kakao";
import passportFacebook from "passport-facebook";
import passportGoogle from "passport-google-oauth20";
import passportNaver from 'passport-naver';
import env from "env-var";
import Container from "typedi";
import UserServicesable from "@/services/interfaces/UserServicesable";
import HashHanlder from "@/handler/HashHandler";
import Context from "@/Context";
import { PRODUCTION_MODE } from "@/utils/util";

interface VerifyPassportable<S> {
  Strategy: S;
  passportName: string;
  verify(userService: UserServicesable): void;
}

export default class PassportHandler {
  private userService: UserServicesable;
  private static passportType =
    passportJWT.Strategy ||
    passportLocal.Strategy ||
    passportKakao.Strategy ||
    passportFacebook.Strategy ||
    passportGoogle.Strategy ||
    passportNaver.Strategy;
  private verifys: Array<
    VerifyPassportable<typeof PassportHandler.passportType>
  >;

  constructor() {
    this.userService = Container.get(Context.USER_SERVICES);
    this.verifys = [
      new Jwt(),
      new Local(),
      new Kakao(),
      new Facebook(),
      new Google(),
      new Naver(),
    ];
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

class Jwt implements VerifyPassportable<typeof passportJWT.Strategy> {
  Strategy: typeof passportJWT.Strategy;
  passportName: string;

  constructor() {
    this.Strategy = passportJWT.Strategy;
    this.passportName = Jwt.prototype.constructor.name.toLowerCase();
  }

  verify(userService: UserServicesable): void {
    passport.use(
      this.passportName,
      new this.Strategy(
        {
          jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: env.get("AUTH_KEY").asString(),
          ignoreExpiration: false,
          passReqToCallback: false,
        },
        async (payload, done) => {
          const user = await userService.getUser(
            payload.email,
            payload.loginType
          );

          if (!user) {
            return done(null, false, { message: "Unauthorized" });
          }

          return done(null, user);
        }
      )
    );
  }
}

class Local implements VerifyPassportable<typeof passportLocal.Strategy> {
  Strategy: typeof passportLocal.Strategy;
  passportName: string;

  constructor() {
    this.Strategy = passportLocal.Strategy;
    this.passportName = Local.prototype.constructor.name.toLowerCase();
  }

  verify(userService: UserServicesable): void {
    passport.use(
      this.passportName,
      new this.Strategy(
        {
          usernameField: "email",
          passwordField: "password",
        },
        async (email, password, done) => {
          const user = await userService.getUser(email, "LOCAL");

          if (!user) {
            return done(null, false, { message: "Non Existent User" });
          }

          const hashHandler = new HashHanlder();

          if (hashHandler.compare(user.password, password)) {
            return done(null, false, { message: "Wrong Password" });
          }

          return done(null, { verifyedUser: user });
        }
      )
    );
  }
}

class Kakao implements VerifyPassportable<typeof passportKakao.Strategy> {
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
          callbackURL: "/api/user/kakao/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const hashHandler = new HashHanlder();
            const loginType = "KAKAO";
            const kakaoEmail =
              profile._json && profile._json.kakao_account.email;
            const user = await userService.getUser(kakaoEmail, loginType);

            const doneData = {
              accessToken,
              refreshToken,
            };

            if (user) {
              return done(null, { ...doneData, verifyedUser: user });
            }

            const newUser = await userService.saveUser({
              loginType,
              email: kakaoEmail,
              name: profile.displayName,
              password: hashHandler.getHash(hashHandler.getRandomSuffix(5)),
            });

            return done(null, {
              ...doneData,
              verifyedUser: newUser,
            });
          } catch (err) {
            return done(err);
          }
        }
      )
    );
  }
}

class Facebook implements VerifyPassportable<typeof passportFacebook.Strategy> {
  Strategy: typeof passportFacebook.Strategy;
  passportName: string;

  constructor() {
    this.Strategy = passportFacebook.Strategy;
    this.passportName = Kakao.prototype.constructor.name.toLowerCase();
  }

  verify(userService: UserServicesable): void {
    passport.use(
      new this.Strategy(
        {
          clientID: env.get("FACEBOOK_CLIENT_ID").asString(),
          clientSecret: env.get("FACEBOOK_CLIENT_SECRET").asString(),
          callbackURL: "/api/user/facebook/callback",
          profileFields: ["id", "email", "displayName"],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            console.log("accessToken =>>", accessToken);
            const hashHandler = new HashHanlder();
            const loginType = "FACEBOOK";
            // 페이스북에서 정상적인 사용자 이메일을 받으려면 http가 아닌 https로 해야한다.
            const email =
              (profile.emails && profile.emails[0].value) ||
              "facebookTest@facebook.com";
            const user = await userService.getUser(email, loginType);

            const doneData = {
              accessToken,
              refreshToken,
            };

            if (user) {
              return done(null, { ...doneData, verifyedUser: user });
            }

            const newUser = await userService.saveUser({
              loginType,
              email,
              name: profile.displayName,
              password: hashHandler.getHash(hashHandler.getRandomSuffix(5)),
            });

            return done(null, {
              ...doneData,
              verifyedUser: newUser,
            });
          } catch (err) {
            return done(err);
          }
        }
      )
    );
  }
}

class Google implements VerifyPassportable<typeof passportGoogle.Strategy> {
  Strategy: typeof passportGoogle.Strategy;
  passportName: string;

  constructor() {
    this.Strategy = passportGoogle.Strategy;
    this.passportName = Google.prototype.constructor.name.toLowerCase();
  }

  verify(userService: UserServicesable): void {
    passport.use(
      this.passportName,
      new this.Strategy(
        {
          clientID: env.get("GOOGLE_CLIENT_ID").asString(),
          clientSecret: env.get("GOOGLE_CLIENT_SECRET").asString(),
          callbackURL: "/api/user/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const hashHandler = new HashHanlder();
            const loginType = "GOOGLE";
            const email = profile._json && profile._json.email;
            const user = await userService.getUser(email, loginType);

            const doneData = {
              accessToken,
              refreshToken,
            };

            if (user) {
              return done(null, { ...doneData, verifyedUser: user });
            }

            const newUser = await userService.saveUser({
              loginType,
              email,
              name: profile.displayName,
              password: hashHandler.getHash(hashHandler.getRandomSuffix(5)),
            });

            return done(null, {
              ...doneData,
              verifyedUser: newUser,
            });
          } catch (err) {
            return done(err);
          }
        }
      )
    );
  }
}

class Naver implements VerifyPassportable<typeof passportNaver.Strategy> {
  Strategy: typeof passportNaver.Strategy;
  passportName: string;

  constructor() {
    this.Strategy = passportNaver.Strategy;
    this.passportName = Naver.prototype.constructor.name.toLowerCase();
  }

  verify(userService: UserServicesable): void {
    passport.use(
      this.passportName,
      new this.Strategy(
        {
          clientID: "",
          clientSecret: "",
          callbackURL: ""
        },
        async (accessToken, refreshToken, profile, done) => {}
      )
    );
  }
}