import express from "express";
import AuthGuard from "@/middlewares/AuthGuard";
import ErrorMiddleware from "@/middlewares/error";
import userRouter from "@/routers/user";

export default (app: express.Application) => {
  const authGuard = new AuthGuard();
  const authURList = ["/api/user/auth/test"];

  app.use(authURList, authGuard.checkAuth);
  app.get("/", (req, res) => res.send("Hello All Login"));
  app.use("/api/user", userRouter);
  app.use(ErrorMiddleware.serverError);
};
