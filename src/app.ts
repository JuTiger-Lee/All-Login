import express from "express";
import routers from "@/routers/index";
import passport from "passport";
import env from "env-var";
import PassportHandler from "@/handler/PassportHandler";
import dotenv from "dotenv";

class App {
  public readonly server: express.Application;
  public readonly PORT: number;

  constructor() {
    this.PORT = env.get("PORT").default(8080).asPortNumber();
    this.server = express();
  }

  bootstrap() {
    this.checkEnv();
    this.initPassport();
    this.setRouter();
  }

  private checkEnv() {
    dotenv.config();
    env.get("DATABASE_URL").required().asString();
    env.get("AUTH_KEY").required().asString();
  }

  private initPassport() {
    this.server.use(passport.initialize());
    new PassportHandler().init();
  }

  private setRouter() {
    routers(this.server);
  }
}

const app = new App();
app.bootstrap();

export default app;
