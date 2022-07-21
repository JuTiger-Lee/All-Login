import express from "express";
import ErrorMiddleware from "@/middlewares/error";

export default (app: express.Application) => {
  app.get("/", (req, res) => res.send("Hello All Login"));
  app.use(ErrorMiddleware.serverError);
};
