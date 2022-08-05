import express from "express";
import AuthGuard from "@/middlewares/AuthGuard";
import ErrorMiddleware from "@/middlewares/error";
import userRouter from "@/routers/user";

export default (app: express.Application) => {
  const authURList = ["/api/user/auth/test"];

  app.use(authURList, (req, res, next) =>
    new AuthGuard().checkAuth(req, res, next)
  );
  app.get("/", (req, res) => res.send("Hello All Login"));
  app.use("/api/user", userRouter);
  app.use(ErrorMiddleware.serverError);
};
