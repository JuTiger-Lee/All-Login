import express from "express";
import UserController from "@/controllers/UserController";

const router = express.Router();
const userController = new UserController();

// ::TODO FIX: TypeDI에 내부의 문제 때문에 req, res, next 파라미터를 controller에 직접 보내야하는 문제가 있음
router.post("/sign-up", (req, res, next) =>
  userController.signUp(req, res, next)
);
router.post("/sign-in", (req, res, next) =>
  userController.signIn(req, res, next)
);
router.post("/auth/test", (req, res, next) =>
  userController.testAuth(req, res, next)
);

export default router;
