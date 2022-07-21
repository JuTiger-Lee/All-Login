import passport from "passport";
import passportJWT, { VerifiedCallback } from "passport-jwt";
import passportLocal from "passport-local";
import env from "env-var";

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const LocalStrategy = passportLocal.Strategy;

export default class PassportHandler {
  private passportOption: {
    usernameField: string;
    passwordField: string;
  };

  private jwtOption: {
    jwtFromRequest: passportJWT.JwtFromRequestFunction;
    // 복호화할시 필요한 secretKey
    secretOrKey: string;
    // token 만료 확인
    ignoreExpiration: boolean;
    passReqToCallback: boolean;
  };

  constructor() {
    this.passportOption = {
      usernameField: "email",
      passwordField: "password",
    };

    this.jwtOption = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: String(env.get("AUTH_KEY").required()),
      ignoreExpiration: false,
      passReqToCallback: false,
    };
  }

  init() {
    this.passportVerify();
    this.jwtVerify();
  }

  private passportVerify() {
    const verify = (
      email: string,
      password: string,
      done: VerifiedCallback
    ) => {};
    passport.use("local", new LocalStrategy(this.passportOption, verify));
  }

  private jwtVerify() {
    const verify = (payload: any, done: VerifiedCallback) => {};
    passport.use("jwt", new JwtStrategy(this.jwtOption, verify));
  }
}
