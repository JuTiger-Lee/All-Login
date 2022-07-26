import passport from "passport";
import passportJWT from "passport-jwt";
import passportLocal from "passport-local";
import env from "env-var";
import Container from "typedi";
import UserServicesable from "@/services/interfaces/UserServicesable";
import HashHanlder from "./HashHandler";
import Context from "@/Context";

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const LocalStrategy = passportLocal.Strategy;

export default class PassportHandler {
  private userService: UserServicesable;
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
    this.userService = Container.get(Context.USER_SERVICES);

    this.passportOption = {
      usernameField: "email",
      passwordField: "password",
    };

    this.jwtOption = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.get("AUTH_KEY").asString(),
      ignoreExpiration: false,
      passReqToCallback: false,
    };
  }

  init() {
    this.passportVerify();
    this.jwtVerify();
  }

  private passportVerify() {
    passport.use(
      "local",
      new LocalStrategy(this.passportOption, async (email, password, done) => {
        const user = await this.userService.getUser(email);

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

  private jwtVerify() {
    passport.use(
      "jwt",
      new JwtStrategy(this.jwtOption, async (payload, done) => {
        const user = await this.userService.getUser(payload.email);

        if (!user) {
          return done(null, false, { message: "Unauthorized" });
        }

        return done(null, user);
      })
    );
  }
}
