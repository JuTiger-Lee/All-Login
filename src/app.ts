import express from "express";
import routers from "@/routers/index";
import passport from "passport";
import env from "env-var";
import dotenv from "dotenv";
import PassportHandler from "@/handler/PassportHandler";
import ApiDocs from "@/controllers/apiDocs/ApiDocs";
import { PRODUCTION_MODE } from "@/utils/util";

class App {
  public readonly server: express.Application;
  public readonly PORT: number;

  constructor() {
    this.PORT = env.get("PORT").default(8080).asPortNumber();
    this.server = express();
  }

  async bootstrap() {
    this.checkEnv();
    this.initExpress();
    this.initSwagger();
    this.initPassport();
    this.setRouter();
  }

  private checkEnv() {
    dotenv.config();
    env.get("NODE_ENV").required();
    env.get("DATABASE_URL").required();
    env.get("AUTH_KEY").required();
  }

  private initExpress() {
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(express.json());
  }

  private initSwagger() {
    const apiDocs = new ApiDocs();
    apiDocs.init();
    const { swaggerUI, specs, setUpOption } = apiDocs.getSwaggerOption();

    if (env.get("NODE_ENV").asString() !== PRODUCTION_MODE) {
      this.server.use(
        "/api-docs",
        swaggerUI.serve,
        swaggerUI.setup(specs, setUpOption)
      );
    }
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
