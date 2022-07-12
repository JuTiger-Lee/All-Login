import express from "express";
import routers from "@/routers/index";

class App {
  public server: express.Application;
  public PORT: number;

  constructor() {
    this.server = express();
    this.PORT = Number(process.env.PORT) || 8080;
  }

  setRouter() {
    routers(this.server);
  }

  bootstrap() {
    this.setRouter();
  }
}

const app = new App();
app.bootstrap();

export default app;
